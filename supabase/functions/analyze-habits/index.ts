/// <reference path="../ambient.d.ts" />

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { habits } = await req.json()
        const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openAiApiKey) {
            throw new Error('API Configuration Error: OPENAI_API_KEY is missing.')
        }

        if (!habits) {
            throw new Error('No habit data provided.')
        }

        const systemPrompt = `You are an analytical assistant for a habit tracker. Be honest, direct, and identify patterns of failure or success. Be concise.`

        const userPrompt = `Analyze these habits: ${JSON.stringify(habits)}`

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('AI Provider Error:', data)
            throw new Error(data.error?.message || 'AI Provider returned an error.')
        }

        const insights = data.choices?.[0]?.message?.content

        if (!insights) {
            throw new Error('No insights generated from the AI provider.')
        }

        return new Response(JSON.stringify({ insights }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        // CATCH-ALL: Ensure we return JSON even for crashes
        const errorMessage = error instanceof Error ? error.message : 'Unknown internal error'
        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Return 200 so client sees the error message
        })
    }
})

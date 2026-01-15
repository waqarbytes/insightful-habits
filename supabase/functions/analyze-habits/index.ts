import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { habits } = await req.json()
        const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openAiApiKey) {
            throw new Error('Missing OPENAI_API_KEY environment variable')
        }

        const systemPrompt = `
You are an analytical assistant embedded in a habit tracking app.

YOUR ROLE:
Explain patterns in user behavior clearly and honestly.

TONE:
- Calm
- Direct
- Neutral
- Analytical

DO:
- Point out repeated failures
- Explain likely causes
- Suggest structural changes
- Reference real data

DO NOT:
- Encourage blindly
- Use motivational language
- Praise effort without evidence
- Soften conclusions

EXAMPLE RESPONSE:
"Your sleep habit fails mainly on weekends.
The data suggests lack of routine, not motivation, is the issue.
Consider a lighter weekend target."

If data is insufficient:
Say that clearly.
`

        const userPrompt = `
Here is the user's habit data:
${JSON.stringify(habits, null, 2)}

Analyze this data and provide insights based on the patterns you see.
`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            }),
        })

        const data = await response.json()
        const insights = data.choices[0].message.content

        return new Response(JSON.stringify({ insights }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

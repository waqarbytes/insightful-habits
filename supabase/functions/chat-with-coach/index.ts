
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
        const { messages, userContext } = await req.json()
        const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openAiApiKey) {
            throw new Error('Configuration Error: OPENAI_API_KEY missing.')
        }

        const systemPrompt = `
You are an expert Health & Fitness Coach and Habit Mentor.
Your goal is to help the user build a healthier lifestyle, answer their fitness/health questions, and keep them motivated.

YOUR EXPERTISE:
- Fitness: Workout routines, exercises, recovery.
- Nutrition: Healthy eating, macros, hydration (General advice only, disclaimer for medical issues).
- Mental Wellness: Stress management, sleep, mindfulness.
- Habit Building: Consistency, overcoming procrastination.

USER CONTEXT:
The user has the following habits tracked in the app:
${JSON.stringify(userContext || {}, null, 2)}

GUIDELINES:
1. Be friendly, energetic, and encouraging! 🌿💪
2. If the user asks about health/fitness (e.g., "How to lose weight?", "Best leg exercises?"), answer them as an expert.
3. If the user talks about their specific habits, use the provided USER CONTEXT to give personalized advice.
4. Be concise. Chat bubbles are small. Keep answers under 3-4 sentences unless a detailed explanation is requested.
5. Disclaimer: If asked about serious medical conditions, advise visiting a doctor.
`

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
                    ...messages
                ],
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('AI Error:', data)
            throw new Error(data.error?.message || 'Chat provider error.')
        }

        const reply = data.choices?.[0]?.message?.content

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Function Error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Coach is sleeping 😴' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})

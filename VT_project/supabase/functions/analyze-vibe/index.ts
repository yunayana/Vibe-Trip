import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Obsługa CORS dla aplikacji mobilnej
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    if (!prompt) {
      throw new Error('Missing prompt in request body')
    }

    // 1. Połączenie z Groq (zamiast OpenAI)
    const groqKey = Deno.env.get('GROQ_API_KEY')
    if (!groqKey) {
      throw new Error('Missing GROQ_API_KEY environment variable')
    }

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Najlepszy darmowy model na Groq
        messages: [
          { 
            role: 'system', 
            content: 'Jesteś ekspertem podróży. Zwróć wyłącznie JSON: {"vibe": "party"|"relax"|"culture"|"nature", "location": "string"|null}.' 
          },
          { role: 'user', content: prompt }
        ],
        // Groq również obsługuje format JSON
        response_format: { type: "json_object" }
      }),
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json()
      throw new Error(`Groq API error: ${aiResponse.status} ${JSON.stringify(errorData)}`)
    }

    const aiData = await aiResponse.json()
    
    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq')
    }

    const result = JSON.parse(aiData.choices[0].message.content)

    // 2. Zapis do bazy danych Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    )

    // Pobranie użytkownika
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user?.id) {
      throw new Error('User not authenticated')
    }

    // Zapis do tabeli vibe_queries
    const { error: insertError } = await supabaseClient.from('vibe_queries').insert({
      user_id: user.id,
      raw_text: prompt,
      interpreted_vibe: result.vibe,
      location_context: result.location
    })

    if (insertError) {
      console.error('Database insert error:', insertError.message)
      // Nie rzucamy błędu, żeby zwrócić wynik użytkownikowi nawet jeśli zapis logu zawiedzie
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Function error:', errorMessage)

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
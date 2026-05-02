import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-timeout',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const amenityMap: Record<string, string> = {
  'museum':    '["tourism"~"museum|gallery"]',
  'nightclub': '["amenity"~"nightclub|bar|pub"]',
  'cafe':      '["amenity"~"cafe|restaurant"]',
  'park':      '["leisure"="park"]',
  'viewpoint': '["tourism"="viewpoint"]',
  'ruins':     '["historic"~"ruins|castle|monument|archaeological_site"]',
  'cemetery':  '["amenity"="grave_yard"]["historic"~"yes|cemetery"]',
  'library':   '["amenity"="library"]',
};

const amenityFallbackMap: Record<string, string> = {
  'cemetery': '["amenity"="grave_yard"]',
};

const cityBbox: Record<string, string> = {
  // Polska
  'Warsaw':   '52.09,20.85,52.31,21.18',
  'Krakow':   '49.97,19.85,50.10,20.10',
  'Gdansk':   '54.30,18.52,54.43,18.75',
  'Wroclaw':  '51.05,16.90,51.18,17.10',
  'Poznan':   '52.33,16.82,52.48,17.02',
  'Lodz':     '51.70,19.32,51.82,19.56',
  // Europa Zachodnia
  'London':      '51.38,-0.25,51.60,0.05',
  'Paris':       '48.81,2.24,48.91,2.42',
  'Berlin':      '52.44,13.25,52.59,13.50',
  'Rome':        '41.83,12.42,41.93,12.58',
  'Barcelona':   '41.32,2.10,41.44,2.25',
  'Madrid':      '40.36,-3.76,40.50,-3.62',
  'Amsterdam':   '52.33,4.82,52.42,4.98',
  'Vienna':      '48.16,16.32,48.27,16.48',
  'Prague':      '50.02,14.33,50.12,14.52',
  'Lisbon':      '38.68,-9.22,38.78,-9.08',
  'Monaco':      '43.72,7.40,43.75,7.44',
  'Venice':      '45.41,12.29,45.46,12.37',
  // Europa Wschodnia / inne
  'Istanbul':    '41.00,28.90,41.10,29.10',
  // Azja
  'Tokyo':       '35.62,139.62,35.79,139.82',
  'Bangkok':     '13.68,100.42,13.82,100.62',
  'Singapore':   '1.24,103.78,1.38,103.92',
  'Dubai':       '25.10,55.12,25.28,55.40',
  // Australia / Ameryki
  'Sydney':      '-33.92,151.15,-33.82,151.28',
  'Miami':       '25.72,-80.32,25.84,-80.16',
  'Los Angeles': '33.95,-118.48,34.12,-118.18',
  'New York':    '40.64,-74.06,40.82,-73.90',
};

const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function queryOverpass(query: string, timeoutMs: number): Promise<any[]> {
  for (const server of OVERPASS_SERVERS) {
    try {
      console.log(`Próba: ${server}`);
      console.log(`Query: ${query}`);
      
      const res = await Promise.race([
        fetch(server, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
        }),
        new Promise<never>((_, r) => setTimeout(() => r(new Error("Timeout")), timeoutMs)),
      ]) as Response;
      
      if (!res.ok) {
        console.log(`Serwer ${server} odpowiedział błędem: ${res.status}`);
        continue;
      }
      
      const data = await res.json();
      console.log(`Wyniki z ${server}: ${data.elements?.length || 0} elementów`);
      
      const places = (data.elements || [])
        .map((el: any) => ({
          name: el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:pl'] || "Miejsce bez nazwy",
          address: el.tags?.["addr:street"]
            ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ''}`.trim()
            : `${el.tags?.['addr:city'] || 'centrum'}`,
          lat: el.lat ?? el.center?.lat,
          lon: el.lon ?? el.center?.lon,
        }))
        .filter((p: any) => p.lat && p.lon);
      
      if (places.length > 0) return places;
      
      console.log(`Serwer zwrócił 0 wyników, próbuje kolejny...`);
    } catch (e: any) {
      console.log(`Błąd serwera ${server}: ${e.message}`);
      continue;
    }
  }
  return [];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    const groqKey = Deno.env.get('GROQ_API_KEY');
    if (!groqKey) throw new Error("Brak GROQ_API_KEY");

    // 1. AI ANALYZE
    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a travel assistant. Extract vibe, location, and amenity from user prompts.
Return ONLY valid JSON, nothing else.
Return exactly 5 places in a compact JSON format. Keep descriptions under 150 characters.

STRICT RULES:
1. "vibe" MUST be exactly one of: party, relax, culture, nature, mysterious, sunset, sad, lonely
2. "location" MUST be a standard English city name. Fix typos: "Newyork"→"New York", "Londyn"→"London", "Warszawa"→"Warsaw", "Rzym"→"Rome", "Paryż"→"Paris", "Tokio"→"Tokyo"
3. "amenity" MUST follow this EXACT mapping — never deviate:
   party → nightclub
   relax → cafe
   culture → museum
   nature → park
   sunset → viewpoint
   mysterious → ruins
   sad → cemetery
   lonely → library

EXAMPLES (follow these exactly):
User: "I want to explore New York with a sad vibe"
Output: {"vibe":"sad","location":"New York","amenity":"cemetery"}

User: "party in Berlin"
Output: {"vibe":"party","location":"Berlin","amenity":"nightclub"}

User: "I want to explore Rome with a mysterious vibe"
Output: {"vibe":"mysterious","location":"Rome","amenity":"ruins"}

User: "relax in Tokyo"
Output: {"vibe":"relax","location":"Tokyo","amenity":"cafe"}

User: "I feel lonely in Paris"
Output: {"vibe":"lonely","location":"Paris","amenity":"library"}

User: "nature walk in Amsterdam"
Output: {"vibe":"nature","location":"Amsterdam","amenity":"park"}`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.0,
      }),
    });

    const aiData = await aiResponse.json();
    console.log("AI raw response:", aiData.choices?.[0]?.message?.content);
    
    const result = JSON.parse(aiData.choices[0].message.content);
    console.log("AI parsed:", result);

    const vibeToAmenity: Record<string, string> = {
      'party':      'nightclub',
      'relax':      'cafe',
      'culture':    'museum',
      'nature':     'park',
      'sunset':     'viewpoint',
      'mysterious': 'ruins',
      'sad':        'cemetery',
      'lonely':     'library',
    };

    const cityAliases: Record<string, string> = {
      'Newyork': 'New York', 'New york': 'New York', 'newyork': 'New York',
      'Warszawa': 'Warsaw', 'warszawa': 'Warsaw',
      'Londyn': 'London', 'londyn': 'London',
      'Rzym': 'Rome', 'rzym': 'Rome',
      'Paryż': 'Paris', 'Paryz': 'Paris',
      'Tokio': 'Tokyo', 'tokio': 'Tokyo',
      'Praga': 'Prague', 'praga': 'Prague',
      'Wiedeń': 'Vienna', 'Wieden': 'Vienna',
      'Madryt': 'Madrid', 'madryt': 'Madrid',
    };

    const validVibes = Object.keys(vibeToAmenity);
    const rawVibe = (result.vibe || 'relax').toLowerCase();
    const vibe = validVibes.includes(rawVibe) ? rawVibe : 'relax';

    const rawLocation = result.location || 'Warsaw';
    const location = cityAliases[rawLocation] ?? rawLocation;

    const amenity = vibeToAmenity[vibe];

    console.log(`✅ Zwalidowano: vibe=${vibe}, location=${location}, amenity=${amenity}`);

    // 2. BUDUJ ZAPYTANIE
    const tagFilter = amenityMap[amenity] || '["amenity"~"cafe|restaurant"]';
    const bbox = cityBbox[location];

    const overpassQuery = bbox
      ? `[out:json][timeout:15];nwr${tagFilter}(${bbox});out center 20;`
      : `[out:json][timeout:15];area[name="${location}"]->.s;nwr${tagFilter}(area.s);out center 20;`;

    // 3. SZUKAJ MIEJSC
    let places = await queryOverpass(overpassQuery, 12000);

    // 4. FALLBACK
    if (places.length === 0 && amenityFallbackMap[amenity]) {
      console.log(`Główny tag dał 0 wyników, próbuje fallback dla ${amenity}`);
      const fallbackFilter = amenityFallbackMap[amenity];
      const fallbackQuery = bbox
        ? `[out:json][timeout:15];nwr${fallbackFilter}(${bbox});out center 20;`
        : `[out:json][timeout:15];area[name="${location}"]->.s;nwr${fallbackFilter}(area.s);out center 20;`;
      places = await queryOverpass(fallbackQuery, 12000);
    }

    // 5. OGRANICZ DO 5 WYNIKÓW
    const limitedPlaces = places.slice(0, 5);

    console.log(`Finalne wyniki: ${limitedPlaces.length} miejsc dla ${amenity} w ${location}`);

    return new Response(JSON.stringify({ vibe, location, places: limitedPlaces }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Główny błąd:", error.message);
    return new Response(JSON.stringify({
      error: error.message,
      vibe: "relax",
      location: "Warsaw",
      places: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { clients_stats, segment } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es un expert en inclusion financière et marketing bancaire au Cameroun (SCB Cameroun).
Tu dois proposer des campagnes d'inclusion financière innovantes et réalistes pour le contexte camerounais.

Retourne un JSON avec cette structure exacte (pas de markdown, juste du JSON brut) :
{
  "segment_analyse": "string",
  "statistiques_segment": {
    "total_clients": number,
    "pourcentage_portfolio": number,
    "revenu_moyen": number,
    "solde_moyen": number
  },
  "campagnes": [
    {
      "titre": "string",
      "description": "string (2-3 phrases)",
      "cible": "string",
      "actions_concretes": ["string", ...],
      "impact_estime": "string",
      "budget_estime": "string",
      "priorite": "haute" | "moyenne" | "basse",
      "canal_principal": "string",
      "indicateurs_succes": ["string", ...]
    }
  ],
  "recommandation_generale": "string"
}

Propose exactement 4 campagnes créatives et adaptées au contexte camerounais.
Pense à : journées portes ouvertes universitaires, comptes jeunes gratuits, réduction paperasse, 
frais d'entretien bas, mobile money, partenariats écoles/universités, programmes femmes entrepreneures, etc.`;

    const userPrompt = `Voici les statistiques du segment "${segment}" de notre portefeuille clients :
${JSON.stringify(clients_stats, null, 2)}

Propose des campagnes d'inclusion financière ciblées pour ce segment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let suggestions;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      suggestions = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse suggestions:", content);
      throw new Error("Invalid AI response format");
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("campaign-suggestions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { client } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es un expert en credit scoring bancaire au Cameroun (SCB Cameroun). 
Analyse les données du client et produis un scoring de crédit détaillé.

Tu dois retourner un JSON avec cette structure exacte (pas de markdown, juste du JSON brut) :
{
  "score": number (0-1000),
  "categorie": "Excellent" | "Bon" | "Moyen" | "Risqué" | "Très Risqué",
  "probabilite_defaut": number (0-100, pourcentage),
  "facteurs_positifs": ["string", ...],
  "facteurs_negatifs": ["string", ...],
  "recommandation": "string",
  "limite_credit_suggeree": number (en FCFA),
  "features_importance": [
    {"feature": "string", "importance": number (0-100), "impact": "positif" | "négatif"}
  ]
}

Critères de scoring :
- Ancienneté client (poids: 15%)
- Revenus mensuels vs crédit en cours (poids: 20%)
- Historique incidents de paiement (poids: 20%)
- Solde moyen du compte (poids: 10%)
- Nombre de transactions bancaires + MoMo (poids: 10%)
- Score comportemental MoMo (poids: 10%)
- Stabilité revenus 6 mois (poids: 10%)
- Secteur informel et ratio MoMo/bancaire (poids: 5%)

Catégories:
- 800-1000: Excellent
- 650-799: Bon
- 500-649: Moyen
- 300-499: Risqué
- 0-299: Très Risqué`;

    const userPrompt = `Analyse ce client pour le credit scoring:
- Nom: ${client.nom} ${client.prenom}
- Type: ${client.type_personne}
- Profession: ${client.profession || 'N/A'}
- Secteur: ${client.secteur_activite || 'N/A'}
- Revenu mensuel: ${client.revenu_mensuel} FCFA
- Date ouverture compte: ${client.date_ouverture_compte}
- Ancienneté: ${client.anciennete_mois} mois
- Type de compte: ${client.type_compte}
- Solde actuel: ${client.solde_actuel} FCFA
- Transactions/mois: ${client.nombre_transactions_mois}
- Crédit en cours: ${client.montant_credit_en_cours} FCFA
- Incidents de paiement: ${client.nombre_incidents_paiement}
- Statut: ${client.statut}
- Ville: ${client.ville}
- Genre: ${client.genre}
- Date naissance: ${client.date_naissance || 'N/A'}`;

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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle markdown code blocks)
    let scoring;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      scoring = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse scoring:", content);
      throw new Error("Invalid AI response format");
    }

    return new Response(JSON.stringify(scoring), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("credit-scoring error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

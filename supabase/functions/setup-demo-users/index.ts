import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const usersToCreate = [
      { email: "ds@scb-demo.cm", password: "DataSci2024!", full_name: "Data Scientist", role: "data_scientist" },
      { email: "conformite@scb-demo.cm", password: "Conform2024!", full_name: "Directeur Conformité", role: "conformite" },
    ];

    const results = [];

    for (const u of usersToCreate) {
      // Check if user already exists
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
      const found = existing?.users?.find((x: any) => x.email === u.email);
      
      if (found) {
        // Update role
        await supabaseAdmin
          .from("user_roles")
          .update({ role: u.role })
          .eq("user_id", found.id);
        results.push({ email: u.email, status: "role_updated", id: found.id });
        continue;
      }

      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });

      if (error) {
        results.push({ email: u.email, status: "error", error: error.message });
        continue;
      }

      // The trigger should create profile and default role, now update role
      if (newUser?.user) {
        await supabaseAdmin
          .from("user_roles")
          .update({ role: u.role })
          .eq("user_id", newUser.user.id);
        results.push({ email: u.email, status: "created", id: newUser.user.id });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

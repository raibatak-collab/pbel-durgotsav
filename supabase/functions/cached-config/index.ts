// Supabase Edge Function: cached-config
// Leverages Supabase's 500,000 Edge Function invocation allowance & 5GB Cached Egress limit.
// Serves cloud configuration with Cloudflare Edge CDN Cache-Control headers.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || "branding";
    const cleanKey = key.replace(/^config_/, "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("campaigns")
      .select("redirect_link")
      .eq("title", `config_${cleanKey}`)
      .maybeSingle();

    if (error || !data || !data.redirect_link) {
      return new Response(JSON.stringify({ error: "Config not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(data.redirect_link);

    // Return with Cloudflare Edge Cache headers (utilizing Cached Egress quota)
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

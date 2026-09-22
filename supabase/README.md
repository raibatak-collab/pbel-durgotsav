# Supabase Edge Functions & Cached Egress Setup

This directory contains Supabase Edge Functions designed to unlock your **500,000 monthly Edge Function Invocations** and route requests through Supabase's **5 GB Cached Egress** tier (Cloudflare Edge CDN).

## Why this helps
- Direct PostgREST database queries (`/rest/v1/`) consume **Database Egress** (which was exceeded).
- Edge Functions return with `Cache-Control: public, s-maxage=3600`, causing Cloudflare to cache the response at the edge.
- Subsequent client requests are served directly from Cloudflare cache, consuming **Cached Egress** instead of database egress.

## Deployment with Supabase CLI
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Link your Supabase project:
   ```bash
   supabase link --project-ref oasjophkiognuecisfxd
   ```
3. Deploy the Edge Function:
   ```bash
   supabase functions deploy cached-config
   ```
4. Once deployed, the endpoint will be active at:
   ```
   https://oasjophkiognuecisfxd.supabase.co/functions/v1/cached-config?key=branding
   ```

// supabase/functions/shopify-oauth-init/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { shop } = await req.json() // shop domain like "mystore.myshopify.com"

  const scopes = 'read_products,write_products,read_inventory'
  const redirectUri = `${Deno.env.get('APP_URL')}/onboarding/shopify/callback`
  const clientId = Deno.env.get('SHOPIFY_API_KEY')
  const nonce = crypto.randomUUID()
  
  // Store nonce in session for verification
  
  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${nonce}`
  
  return new Response(JSON.stringify({ authUrl }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
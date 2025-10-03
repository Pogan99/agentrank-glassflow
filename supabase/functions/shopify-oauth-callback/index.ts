// supabase/functions/shopify-oauth-callback/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { code, shop, state } = await req.json()

    // Verify state/nonce (TODO: implement proper state verification)

    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Deno.env.get('VITE_SHOPIFY_API_KEY'),
        client_secret: Deno.env.get('SHOPIFY_API_SECRET'),
        code
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`Shopify token exchange failed: ${tokenResponse.statusText}`)
    }

    const { access_token, scope } = await tokenResponse.json()

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Save to database using service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabaseAdmin.from('user_profiles').upsert({
      id: user.id,
      shopify_shop_domain: shop,
      shopify_access_token: access_token,
      shopify_scope: scope
    })

    // Trigger product import job
    await supabaseAdmin.functions.invoke('import-shopify-products', {
      body: { userId: user.id }
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('OAuth callback error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'OAuth callback failed'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
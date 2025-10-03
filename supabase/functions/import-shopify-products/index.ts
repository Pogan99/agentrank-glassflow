// supabase/functions/import-shopify-products/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { userId } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Get user's Shopify credentials
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('shopify_shop_domain, shopify_access_token')
    .eq('id', userId)
    .single()
  
  if (!profile || !profile.shopify_shop_domain || !profile.shopify_access_token) {
    return new Response(JSON.stringify({ error: 'Shopify not connected' }), { status: 400 })
  }
  
  // Create sync job
  const { data: job } = await supabase
    .from('sync_jobs')
    .insert({
      user_id: userId,
      job_type: 'product_import',
      status: 'running',
      started_at: new Date().toISOString()
    })
    .select()
    .single()
  
  try {
    let hasNextPage = true
    let pageInfo = null
    let totalProducts = 0
    
    while (hasNextPage) {
      const query: string = pageInfo 
        ? `after: "${pageInfo}"`
        : 'first: 250'
      
      const response: Response = await fetch(
        `https://${profile.shopify_shop_domain}/admin/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': profile.shopify_access_token
          },
          body: JSON.stringify({
            query: `{
              products(${query}) {
                edges {
                  cursor
                  node {
                    id
                    title
                    description
                    descriptionHtml
                    vendor
                    productType
                    tags
                    handle
                    status
                    publishedAt
                    seo {
                      title
                      description
                    }
                    featuredImage {
                      url
                      altText
                    }
                    images(first: 10) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          price
                          compareAtPrice
                          inventoryQuantity
                        }
                      }
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }`
          })
        }
      )
      
      const { data }: any = await response.json()
      
      // Insert/update products
      for (const edge of data.products.edges) {
        const product = edge.node
        const variant = product.variants.edges[0]?.node
        
        await supabase.from('products').upsert({
          user_id: userId,
          shopify_product_id: product.id.split('/').pop(),
          shopify_variant_id: variant?.id.split('/').pop(),
          title: product.title,
          description: product.description,
          body_html: product.descriptionHtml,
          vendor: product.vendor,
          product_type: product.productType,
          tags: product.tags,
          handle: product.handle,
          status: product.status.toLowerCase(),
          published_at: product.publishedAt,
          seo_title: product.seo.title,
          seo_description: product.seo.description,
          featured_image: product.featuredImage?.url,
          images: product.images.edges.map((e: any) => ({
            src: e.node.url,
            alt: e.node.altText
          })),
          price: parseFloat(variant?.price || '0'),
          compare_at_price: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
          inventory_quantity: variant?.inventoryQuantity || 0,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,shopify_product_id'
        })
        
        totalProducts++
      }
      
      hasNextPage = data.products.pageInfo.hasNextPage
      pageInfo = data.products.pageInfo.endCursor
    }
    
    // Mark job complete
    await supabase.from('sync_jobs').update({
      status: 'completed',
      total_items: totalProducts,
      processed_items: totalProducts,
      completed_at: new Date().toISOString()
    }).eq('id', job.id)
    
    // Trigger ACP feed generation
    await supabase.functions.invoke('generate-acp-feed', {
      body: { userId }
    })
    
    return new Response(JSON.stringify({ 
      success: true, 
      productsImported: totalProducts 
    }))
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await supabase.from('sync_jobs').update({
      status: 'failed',
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    }).eq('id', job.id)
    
    throw error
  }
})
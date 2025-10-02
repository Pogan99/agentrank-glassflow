// supabase/functions/analyze-product/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { productId, userId } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )
  
  // Get product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('user_id', userId)
    .single()
  
  // 1. Analyze image with Vision AI
  let imageAnalysis = null
  if (product.featured_image) {
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this product image for e-commerce optimization. Extract:
- Material (what it's made of)
- Colors (dominant colors)
- Style/aesthetic (modern, rustic, minimalist, etc)
- Use case (what it's for)
- Target demographic
- Key visual features

Return JSON only with these fields as arrays of keywords.`
            },
            {
              type: 'image_url',
              image_url: { url: product.featured_image }
            }
          ]
        }],
        response_format: { type: 'json_object' },
        max_tokens: 500
      })
    })
    
    const visionData = await visionResponse.json()
    imageAnalysis = JSON.parse(visionData.choices[0].message.content)
  }
  
  // 2. Check ACP compliance
  const acpChecks = {
    has_title: !!product.title && product.title.length >= 10,
    has_description: !!product.description && product.description.length >= 50,
    has_price: !!product.price && product.price > 0,
    has_image: !!product.featured_image,
    has_inventory: product.inventory_quantity !== null,
    has_brand: !!product.vendor,
    has_gtin: false, // Shopify doesn't store this by default
    title_length_ok: product.title && product.title.length <= 140,
    has_multiple_images: product.images && product.images.length >= 2
  }
  
  const passedChecks = Object.values(acpChecks).filter(v => v).length
  const acpScore = Math.round((passedChecks / Object.keys(acpChecks).length) * 100)
  
  const missingFields = Object.keys(acpChecks)
    .filter(key => !acpChecks[key])
    .map(key => key.replace('has_', '').replace('_', ' '))
  
  // 3. Generate optimization suggestions
  const optimizationPrompt = `
You are an e-commerce SEO expert. Optimize this Shopify product for ChatGPT Shopping (ACP protocol).

CURRENT PRODUCT:
Title: ${product.title}
Description: ${product.description}
Tags: ${product.tags?.join(', ') || 'none'}
Vendor: ${product.vendor || 'unknown'}

IMAGE ANALYSIS:
${JSON.stringify(imageAnalysis, null, 2)}

ACP COMPLIANCE ISSUES:
${missingFields.join(', ')}
Current score: ${acpScore}/100

TASK:
Generate optimized product data that will:
1. Make the product discoverable in ChatGPT Shopping
2. Include buyer intent keywords
3. Meet all ACP required fields
4. Be compelling to AI agents making recommendations

RETURN JSON ONLY:
{
  "title": "optimized title (max 140 chars, front-load keywords)",
  "description": "optimized description with bullets, use cases, materials",
  "tags": ["keyword1", "keyword2", ...],
  "brand": "brand name if identifiable",
  "reasoning": {
    "title": "why this title works better",
    "description": "key improvements made",
    "tags": "strategy for tag selection"
  }
}
`

  const optimizationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: optimizationPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  })
  
  const optimizationData = await optimizationResponse.json()
  const suggestions = JSON.parse(optimizationData.choices[0].message.content)
  
  // Calculate new ACP score with suggestions
  const afterScore = Math.min(100, acpScore + 30) // estimate improvement
  
  // Save optimization record
  const { data: optimization } = await supabase
    .from('optimizations')
    .insert({
      user_id: userId,
      product_id: productId,
      before_data: {
        title: product.title,
        description: product.description,
        tags: product.tags,
        vendor: product.vendor
      },
      after_data: suggestions,
      reasoning: suggestions.reasoning,
      image_analysis: imageAnalysis,
      confidence_scores: {
        title: 0.9,
        description: 0.85,
        tags: 0.8
      }
    })
    .select()
    .single()
  
  return new Response(JSON.stringify({
    optimization_id: optimization.id,
    current_acp_score: acpScore,
    potential_acp_score: afterScore,
    missing_fields: missingFields,
    suggestions,
    image_analysis: imageAnalysis
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
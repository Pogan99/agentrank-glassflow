import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get product
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    // Check credits
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('optimization_credits_used, optimization_credits_limit, credits_reset_at')
      .eq('id', product.user_id)
      .single();

    if (profileError) throw profileError;

    if (profile.optimization_credits_used >= profile.optimization_credits_limit) {
      throw new Error('Credit limit reached');
    }

    // Prepare AI prompt
    const systemPrompt = `You are an expert in ChatGPT Shopping (formerly Google Shopping) optimization and ACP (Automated Content for Products) compliance. 
    Analyze the product and provide optimized title, description, and tags that will maximize visibility in ChatGPT Shopping searches.
    
    Key requirements:
    - Title: 150 characters max, include brand, key features, and product type
    - Description: 5000 characters max, detailed, feature-rich, natural language
    - Tags: Relevant keywords for search optimization
    - Follow Google Merchant Center best practices
    - Be specific and accurate
    - Include technical specifications when relevant`;

    const userPrompt = `Optimize this product for ChatGPT Shopping:
    
    Current Title: ${product.title}
    Current Description: ${product.description || 'No description'}
    Current Tags: ${product.tags?.join(', ') || 'No tags'}
    Price: ${product.price} ${product.currency}
    Vendor: ${product.vendor || 'Unknown'}
    Product Type: ${product.product_type || 'Unknown'}
    
    Provide optimizations in JSON format with:
    {
      "title": "optimized title",
      "description": "optimized description",
      "tags": ["tag1", "tag2", "tag3"],
      "reasoning": {
        "title_changes": "explanation",
        "description_changes": "explanation",
        "tag_changes": "explanation"
      },
      "confidence_scores": {
        "title": 0-100,
        "description": 0-100,
        "tags": 0-100
      }
    }`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Create optimization record
    const { data: optimization, error: optimizationError } = await supabaseClient
      .from('optimizations')
      .insert({
        user_id: product.user_id,
        product_id: productId,
        before_data: {
          title: product.title,
          description: product.description,
          tags: product.tags,
        },
        after_data: {
          title: analysis.title,
          description: analysis.description,
          tags: analysis.tags,
        },
        reasoning: analysis.reasoning,
        confidence_scores: analysis.confidence_scores,
      })
      .select()
      .single();

    if (optimizationError) throw optimizationError;

    // Update credits
    await supabaseClient
      .from('user_profiles')
      .update({
        optimization_credits_used: profile.optimization_credits_used + 1,
      })
      .eq('id', product.user_id);

    return new Response(
      JSON.stringify({
        success: true,
        optimization,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error analyzing product:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

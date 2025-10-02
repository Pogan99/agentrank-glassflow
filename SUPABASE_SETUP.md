# AgentRanked - Supabase Backend Setup Guide

This guide walks you through setting up the complete Supabase backend infrastructure for AgentRanked.

## Prerequisites

- Supabase account ([sign up](https://supabase.com))
- Shopify Partner account (for OAuth)
- OpenAI API key (for product analysis)

## 1. Database Setup

### Migrations

The database schema has been automatically created through migrations. The following tables are now available:

- **user_profiles** - User accounts with Shopify connection and subscription details
- **products** - Shopify product cache with ACP compliance scores
- **optimizations** - AI-generated optimization suggestions
- **acp_feeds** - Generated product feeds for ChatGPT Shopping
- **sync_jobs** - Background job tracking
- **alerts** - User notifications and alerts
- **webhook_events** - Shopify webhook event log

### Row Level Security (RLS)

All tables have RLS policies enabled to ensure users can only access their own data:
- Users can only view/modify their own profiles
- Users can only access their own products and optimizations
- Service role can manage webhooks

## 2. Storage Setup

### ACP Feeds Bucket

A public storage bucket `acp-feeds` has been created for storing generated product feeds:

- **Public access**: Feeds can be accessed via public URLs
- **User isolation**: Each user has their own folder (user_id)
- **File management**: Users can upload, update, and delete their own feeds

Access your feeds at: `https://[PROJECT-REF].supabase.co/storage/v1/object/public/acp-feeds/[USER-ID]/feed.json`

## 3. Edge Functions

The following Edge Functions are deployed and ready to use:

### import-shopify-products
Imports all products from connected Shopify store.
- **Trigger**: Manual via API call
- **Function**: Fetches products, calculates ACP scores, stores in database
- **Credits**: No credits required

### analyze-product
Analyzes a single product and generates AI-powered optimizations.
- **Trigger**: Manual via API call
- **Function**: Uses Lovable AI to optimize title, description, and tags
- **Credits**: Deducts 1 optimization credit per use

### apply-optimization
Applies optimization suggestions back to Shopify store.
- **Trigger**: Manual via API call
- **Function**: Updates product in Shopify via API
- **Credits**: No credits required

### generate-acp-feed
Generates ChatGPT Shopping feed from products.
- **Trigger**: Manual via API call or scheduled
- **Function**: Creates JSON feed, uploads to storage
- **Credits**: No credits required

### shopify-webhook
Handles real-time Shopify product updates.
- **Trigger**: Shopify webhook
- **Function**: Processes product create/update/delete events
- **Security**: Verifies webhook signature

## 4. Environment Variables & Secrets

### Required Secrets

Add these secrets in your Supabase project (Settings → Edge Functions → Secrets):

```bash
# Shopify
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret

# Lovable AI (auto-configured)
LOVABLE_API_KEY=auto-generated

# Supabase (auto-configured)
SUPABASE_URL=auto-generated
SUPABASE_SERVICE_ROLE_KEY=auto-generated
SUPABASE_PUBLISHABLE_KEY=auto-generated
```

### Setting Secrets

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → Edge Functions**
4. Add each secret in the **Secrets** section

## 5. Shopify Integration Setup

### Step 1: Create Shopify App

1. Go to [Shopify Partners](https://partners.shopify.com)
2. Create a new app
3. Set up OAuth:
   - **App URL**: `https://your-app.com`
   - **Allowed redirection URL(s)**: `https://your-app.com/auth/shopify/callback`
   - **Required scopes**:
     - `read_products`
     - `write_products`
     - `read_inventory`
     - `write_inventory`

### Step 2: Configure Webhooks

In your Shopify app settings, add these webhook subscriptions:

- **products/create** → `https://[PROJECT-REF].supabase.co/functions/v1/shopify-webhook`
- **products/update** → `https://[PROJECT-REF].supabase.co/functions/v1/shopify-webhook`
- **products/delete** → `https://[PROJECT-REF].supabase.co/functions/v1/shopify-webhook`

Set webhook format to **JSON**.

## 6. Lovable AI Setup

Lovable AI is used for product analysis and optimization.

### Enable Lovable AI

The `LOVABLE_API_KEY` secret is automatically provisioned when you enable Lovable AI in your project.

### Model Used

- **Default model**: `google/gemini-2.5-flash`
- **Features**: ChatGPT Shopping optimization, content generation
- **Pricing**: Usage-based (see Lovable AI pricing)

## 7. Testing the Setup

### Test Database Connection

```typescript
import { supabase } from '@/integrations/supabase/client';

// Get current user profile
const { data: profile, error } = await supabase
  .from('user_profiles')
  .select('*')
  .single();

console.log(profile);
```

### Test Product Import

```typescript
import { APIClient } from '@/lib/api/client';

// Import products from Shopify
const result = await APIClient.importShopifyProducts(userId);
console.log(`Imported ${result.productsImported} products`);
```

### Test Product Analysis

```typescript
// Analyze a product
const optimization = await APIClient.analyzeProduct(productId);
console.log('Optimization:', optimization);
```

### Test Feed Generation

```typescript
// Generate ACP feed
const feed = await APIClient.generateACPFeed(userId);
console.log('Feed URL:', feed.feedUrl);
```

## 8. Credit System

### How Credits Work

- **Free Plan**: 30 optimizations/day
- **Starter Plan**: 100 optimizations/day
- **Pro Plan**: Unlimited optimizations

Credits are tracked in `user_profiles.optimization_credits_used` and reset daily via `credits_reset_at`.

### Manual Credit Reset

```sql
UPDATE user_profiles
SET 
  optimization_credits_used = 0,
  credits_reset_at = NOW() + INTERVAL '1 day'
WHERE id = 'user-id';
```

## 9. Monitoring & Debugging

### View Edge Function Logs

1. Go to **Edge Functions** in Supabase Dashboard
2. Select a function
3. View **Logs** tab

### Check Webhook Events

```sql
SELECT * FROM webhook_events
WHERE processed = false
ORDER BY created_at DESC
LIMIT 10;
```

### Monitor Sync Jobs

```sql
SELECT * FROM sync_jobs
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### View Alerts

```sql
SELECT * FROM alerts
WHERE severity = 'error'
  AND dismissed = false
ORDER BY created_at DESC;
```

## 10. Production Checklist

- [ ] All secrets configured
- [ ] Shopify app OAuth tested
- [ ] Webhooks receiving events
- [ ] Product import working
- [ ] AI analysis generating results
- [ ] Feed generation successful
- [ ] Storage bucket accessible
- [ ] RLS policies tested
- [ ] Credit system functioning
- [ ] Monitoring set up

## 11. API Usage Examples

### Complete User Flow

```typescript
import { APIClient } from '@/lib/api/client';

// 1. Create user profile after signup
const profile = await APIClient.createProfile({
  id: user.id,
  email: user.email,
  plan: 'free',
});

// 2. Import products from Shopify
const importResult = await APIClient.importShopifyProducts(user.id);

// 3. Get products
const products = await APIClient.getProducts(user.id, {
  status: 'active',
  limit: 10,
});

// 4. Analyze a product
const optimization = await APIClient.analyzeProduct(products[0].id);

// 5. Apply optimization
await APIClient.applyOptimizationToShopify(
  optimization.id,
  ['title', 'description', 'tags']
);

// 6. Generate feed
const feed = await APIClient.generateACPFeed(user.id);

console.log('Feed URL:', feed.feedUrl);
```

## Support

For issues or questions:
- Check [Supabase Documentation](https://supabase.com/docs)
- Review Edge Function logs
- Contact support

## Next Steps

1. Implement frontend UI components
2. Add scheduled sync (cron jobs)
3. Implement analytics dashboard
4. Add more AI features
5. Set up payment processing (Stripe)

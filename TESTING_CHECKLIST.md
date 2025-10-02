# AgentRanked Backend Testing Checklist

## Pre-Flight Checklist

### Database
- [ ] All 7 tables created and accessible
  - [ ] user_profiles
  - [ ] products
  - [ ] optimizations
  - [ ] acp_feeds
  - [ ] sync_jobs
  - [ ] alerts
  - [ ] webhook_events
- [ ] RLS policies enabled on all tables
- [ ] Correct indexes created for performance

### Storage
- [ ] `acp-feeds` bucket exists
- [ ] Bucket is set to public
- [ ] CORS policy configured for client uploads

### Edge Functions
- [ ] All 9 functions deployed to Supabase
  - [ ] shopify-oauth-init
  - [ ] shopify-oauth-callback
  - [ ] import-shopify-products
  - [ ] analyze-product
  - [ ] apply-optimization
  - [ ] generate-acp-feed
  - [ ] scheduled-sync
  - [ ] reset-credits
  - [ ] shopify-webhook

### Environment Variables
- [ ] VITE_SUPABASE_URL set
- [ ] SUPABASE_SERVICE_ROLE_KEY set
- [ ] VITE_SHOPIFY_API_KEY set
- [ ] SHOPIFY_API_SECRET set
- [ ] OPENAI_API_KEY set
- [ ] STRIPE_SECRET_KEY set (if billing enabled)
- [ ] APP_URL set

### API Keys
- [ ] OpenAI API key valid and has credits
- [ ] Shopify API credentials valid
- [ ] Supabase keys match project

## Integration Tests

### 1. User Registration & Profile
```bash
# Create test user via Supabase Auth
# Check that user_profiles row is auto-created via trigger
```
- [ ] User can sign up
- [ ] Profile row created automatically
- [ ] Default credits assigned (20 for Starter plan)
- [ ] Email confirmation works

### 2. Shopify OAuth Flow
```bash
# Visit /api/shopify/oauth
# Complete OAuth handshake
# Verify store connection saved
```
- [ ] OAuth init redirects to Shopify
- [ ] Callback receives access token
- [ ] Store details saved to user_profiles
- [ ] Access token encrypted and stored

### 3. Product Import
```bash
# Trigger import-shopify-products function
# Check products table populated
```
- [ ] Products fetched from Shopify
- [ ] Product data mapped correctly
- [ ] Images and variants included
- [ ] Sync job created with status

### 4. Product Analysis
```bash
# Call analyze-product function with product_id
# Check optimizations table for suggestions
```
- [ ] OpenAI analyzes product
- [ ] Suggestions stored in optimizations table
- [ ] ACP score calculated (0-100)
- [ ] Credits deducted from user

### 5. Apply Optimization
```bash
# Call apply-optimization with optimization_id
# Verify product updated in Shopify
```
- [ ] Optimization fetched from database
- [ ] Shopify product updated via API
- [ ] Status changed to 'applied'
- [ ] Webhook confirms update

### 6. ACP Feed Generation
```bash
# Call generate-acp-feed for user
# Check acp-feeds table and storage bucket
```
- [ ] Feed generated in ACP JSON format
- [ ] Uploaded to acp-feeds bucket
- [ ] Public URL accessible
- [ ] Feed includes all active products

### 7. Scheduled Sync
```bash
# Manually invoke scheduled-sync function
# Check sync_jobs table for new entries
```
- [ ] Identifies users needing sync
- [ ] Triggers product import for each
- [ ] Creates sync job records
- [ ] Updates last_sync_at timestamps

## Common Issues to Check

### Database Issues
- [ ] **Missing tables**: Run migrations in correct order
- [ ] **RLS blocking queries**: Verify policies allow service role
- [ ] **Foreign key errors**: Check user_id references are correct

### Edge Function Issues
- [ ] **404 on function call**: Function not deployed (run `supabase functions deploy`)
- [ ] **CORS errors**: Add allowed origins to function headers
- [ ] **Timeout errors**: Check function execution time (max 60s)
- [ ] **Import errors**: Verify Deno imports use full URLs

### API Integration Issues
- [ ] **Shopify 401**: API key invalid or expired
- [ ] **OpenAI 429**: Rate limit hit, need to wait or upgrade
- [ ] **Webhook 404**: Webhook URL not registered in Shopify

### Storage Issues
- [ ] **Upload fails**: Check bucket permissions and RLS policies
- [ ] **File not accessible**: Verify bucket is public
- [ ] **CORS error on upload**: Configure CORS in bucket settings

## Debugging Commands

```bash
# View Edge Function logs
supabase functions logs <function-name>

# Test Edge Function locally
supabase functions serve <function-name>

# Check database connection
psql $DATABASE_URL -c "SELECT * FROM user_profiles LIMIT 1;"

# Verify environment variables
echo $VITE_SUPABASE_URL
echo $OPENAI_API_KEY

# Test storage bucket
curl https://<project-ref>.supabase.co/storage/v1/object/public/acp-feeds/test.json
```

## Success Criteria

✅ All automated tests pass in test-backend.ts
✅ Can complete full user journey: signup → connect Shopify → import → analyze → optimize → feed
✅ No console errors on frontend
✅ All Edge Functions respond with valid data
✅ RLS policies properly restrict data access
✅ Webhooks successfully received and processed

## Notes

- Run automated tests first: `npx tsx test-backend.ts`
- If any test fails, check corresponding section in this checklist
- Use debug-functions.ts helpers to isolate issues
- Always test with a fresh test user to avoid state conflicts

import { supabase } from '@/integrations/supabase/client';
import type {
  UserProfile,
  Product,
  Optimization,
  ACPFeed,
  SyncJob,
  Alert,
  WebhookEvent,
  JobType,
  AlertType,
  AlertSeverity,
} from '@/types/database';

export class APIClient {
  // User Profiles
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  }

  static async createProfile(profile: Partial<UserProfile> & { id: string; email: string }) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  }

  // Products
  static async getProducts(userId: string, filters?: {
    status?: string;
    acp_compliant?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.acp_compliant !== undefined) {
      query = query.eq('acp_compliant', filters.acp_compliant);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  }

  static async getProduct(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data as Product;
  }

  static async updateProduct(productId: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  }

  static async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
  }

  // Optimizations
  static async getOptimizations(userId: string, productId?: string) {
    let query = supabase
      .from('optimizations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Optimization[];
  }

  static async createOptimization(optimization: Omit<Optimization, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('optimizations')
      .insert(optimization)
      .select()
      .single();
    
    if (error) throw error;
    return data as Optimization;
  }

  static async applyOptimization(optimizationId: string, appliedFields: string[]) {
    const { data, error } = await supabase
      .from('optimizations')
      .update({
        applied: true,
        applied_fields: appliedFields,
        applied_at: new Date().toISOString(),
      })
      .eq('id', optimizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Optimization;
  }

  // ACP Feeds
  static async getACPFeed(userId: string) {
    const { data, error } = await supabase
      .from('acp_feeds')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as ACPFeed | null;
  }

  static async upsertACPFeed(feed: Partial<ACPFeed> & { user_id: string; feed_url: string; feed_data: Record<string, any> }) {
    const { data, error } = await supabase
      .from('acp_feeds')
      .upsert([feed], { onConflict: 'user_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data as ACPFeed;
  }

  // Sync Jobs
  static async getSyncJobs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as SyncJob[];
  }

  static async createSyncJob(job: Omit<SyncJob, 'id' | 'created_at' | 'started_at' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('sync_jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) throw error;
    return data as SyncJob;
  }

  static async updateSyncJob(jobId: string, updates: Partial<SyncJob>) {
    const { data, error } = await supabase
      .from('sync_jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    return data as SyncJob;
  }

  // Alerts
  static async getAlerts(userId: string, filters?: {
    read?: boolean;
    dismissed?: boolean;
    limit?: number;
  }) {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.read !== undefined) {
      query = query.eq('read', filters.read);
    }
    if (filters?.dismissed !== undefined) {
      query = query.eq('dismissed', filters.dismissed);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Alert[];
  }

  static async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'read' | 'dismissed'>) {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data as Alert;
  }

  static async markAlertRead(alertId: string, read = true) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ read })
      .eq('id', alertId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Alert;
  }

  static async dismissAlert(alertId: string) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ dismissed: true })
      .eq('id', alertId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Alert;
  }

  static async deleteAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId);
    
    if (error) throw error;
  }

  // Edge Functions
  static async importShopifyProducts(userId: string) {
    const { data, error } = await supabase.functions.invoke('import-shopify-products', {
      body: { userId },
    });
    
    if (error) throw error;
    return data;
  }

  static async analyzeProduct(productId: string) {
    const { data, error } = await supabase.functions.invoke('analyze-product', {
      body: { productId },
    });
    
    if (error) throw error;
    return data;
  }

  static async applyOptimizationToShopify(optimizationId: string, fields: string[]) {
    const { data, error } = await supabase.functions.invoke('apply-optimization', {
      body: { optimizationId, fields },
    });
    
    if (error) throw error;
    return data;
  }

  static async generateACPFeed(userId: string) {
    const { data, error } = await supabase.functions.invoke('generate-acp-feed', {
      body: { userId },
    });

    if (error) throw error;
    return data;
  }

  // Shopify OAuth
  static async initiateShopifyOAuth(shop: string) {
    const { data, error } = await supabase.functions.invoke('shopify-oauth-init', {
      body: { shop },
    });

    if (error) throw error;
    return data as { authUrl: string };
  }

  static async handleShopifyCallback(code: string, shop: string, state: string) {
    const { data: { session } } = await supabase.auth.getSession();

    const { data, error } = await supabase.functions.invoke('shopify-oauth-callback', {
      body: { code, shop, state },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (error) throw error;
    return data;
  }
}

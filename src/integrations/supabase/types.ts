export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      acp_feeds: {
        Row: {
          created_at: string | null
          feed_data: Json
          feed_url: string
          id: string
          last_generated_at: string | null
          last_validated_at: string | null
          next_sync_at: string | null
          overall_score: number | null
          products_excluded: number | null
          products_included: number | null
          user_id: string
          validation_errors: Json | null
          validation_warnings: Json | null
        }
        Insert: {
          created_at?: string | null
          feed_data: Json
          feed_url: string
          id?: string
          last_generated_at?: string | null
          last_validated_at?: string | null
          next_sync_at?: string | null
          overall_score?: number | null
          products_excluded?: number | null
          products_included?: number | null
          user_id: string
          validation_errors?: Json | null
          validation_warnings?: Json | null
        }
        Update: {
          created_at?: string | null
          feed_data?: Json
          feed_url?: string
          id?: string
          last_generated_at?: string | null
          last_validated_at?: string | null
          next_sync_at?: string | null
          overall_score?: number | null
          products_excluded?: number | null
          products_included?: number | null
          user_id?: string
          validation_errors?: Json | null
          validation_warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "acp_feeds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          action_url: string | null
          alert_type: string | null
          created_at: string | null
          dismissed: boolean | null
          id: string
          message: string
          products_affected: string[] | null
          read: boolean | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          alert_type?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message: string
          products_affected?: string[] | null
          read?: boolean | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          alert_type?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message?: string
          products_affected?: string[] | null
          read?: boolean | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      optimizations: {
        Row: {
          after_data: Json
          applied: boolean | null
          applied_at: string | null
          applied_fields: string[] | null
          before_data: Json
          confidence_scores: Json | null
          created_at: string | null
          id: string
          image_analysis: Json | null
          product_id: string
          reasoning: Json | null
          user_id: string
        }
        Insert: {
          after_data: Json
          applied?: boolean | null
          applied_at?: string | null
          applied_fields?: string[] | null
          before_data: Json
          confidence_scores?: Json | null
          created_at?: string | null
          id?: string
          image_analysis?: Json | null
          product_id: string
          reasoning?: Json | null
          user_id: string
        }
        Update: {
          after_data?: Json
          applied?: boolean | null
          applied_at?: string | null
          applied_fields?: string[] | null
          before_data?: Json
          confidence_scores?: Json | null
          created_at?: string | null
          id?: string
          image_analysis?: Json | null
          product_id?: string
          reasoning?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimizations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          acp_compliant: boolean | null
          acp_score: number | null
          body_html: string | null
          compare_at_price: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          featured_image: string | null
          handle: string | null
          id: string
          images: Json | null
          inventory_policy: string | null
          inventory_quantity: number | null
          last_synced_at: string | null
          missing_fields: string[] | null
          price: number | null
          product_type: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          shopify_product_id: string
          shopify_variant_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          vendor: string | null
        }
        Insert: {
          acp_compliant?: boolean | null
          acp_score?: number | null
          body_html?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured_image?: string | null
          handle?: string | null
          id?: string
          images?: Json | null
          inventory_policy?: string | null
          inventory_quantity?: number | null
          last_synced_at?: string | null
          missing_fields?: string[] | null
          price?: number | null
          product_type?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          shopify_product_id: string
          shopify_variant_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          vendor?: string | null
        }
        Update: {
          acp_compliant?: boolean | null
          acp_score?: number | null
          body_html?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured_image?: string | null
          handle?: string | null
          id?: string
          images?: Json | null
          inventory_policy?: string | null
          inventory_quantity?: number | null
          last_synced_at?: string | null
          missing_fields?: string[] | null
          price?: number | null
          product_type?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          shopify_product_id?: string
          shopify_variant_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string | null
          processed_items: number | null
          result_data: Json | null
          started_at: string | null
          status: string | null
          total_items: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string | null
          processed_items?: number | null
          result_data?: Json | null
          started_at?: string | null
          status?: string | null
          total_items?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string | null
          processed_items?: number | null
          result_data?: Json | null
          started_at?: string | null
          status?: string | null
          total_items?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          credits_reset_at: string | null
          email: string
          id: string
          last_sync_at: string | null
          name: string | null
          onboarding_completed: boolean | null
          optimization_credits_limit: number | null
          optimization_credits_used: number | null
          plan: string | null
          shopify_access_token: string | null
          shopify_scope: string | null
          shopify_shop_domain: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          credits_reset_at?: string | null
          email: string
          id: string
          last_sync_at?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          optimization_credits_limit?: number | null
          optimization_credits_used?: number | null
          plan?: string | null
          shopify_access_token?: string | null
          shopify_scope?: string | null
          shopify_shop_domain?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          credits_reset_at?: string | null
          email?: string
          id?: string
          last_sync_at?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          optimization_credits_limit?: number | null
          optimization_credits_used?: number | null
          plan?: string | null
          shopify_access_token?: string | null
          shopify_scope?: string | null
          shopify_shop_domain?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          shopify_topic: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          shopify_topic: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          shopify_topic?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          invite_count: number | null
          invited_by: string | null
          referral_code: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          invite_count?: number | null
          invited_by?: string | null
          referral_code: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          invite_count?: number | null
          invited_by?: string | null
          referral_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

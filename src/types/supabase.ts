export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          amount: number
          created_at: string
          game_round_id: string
          id: string
          is_winner: boolean | null
          selected_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          game_round_id: string
          id?: string
          is_winner?: boolean | null
          selected_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          game_round_id?: string
          id?: string
          is_winner?: boolean | null
          selected_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_rounds: {
        Row: {
          created_at: string
          created_by: string
          end_time: string | null
          id: string
          start_time: string
          status: string
          total_bets: number | null
          total_payout: number | null
          updated_at: string
          winning_number: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          end_time?: string | null
          id?: string
          start_time?: string
          status?: string
          total_bets?: number | null
          total_payout?: number | null
          updated_at?: string
          winning_number?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          end_time?: string | null
          id?: string
          start_time?: string
          status?: string
          total_bets?: number | null
          total_payout?: number | null
          updated_at?: string
          winning_number?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_resource_id: string | null
          related_resource_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_resource_id?: string | null
          related_resource_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_resource_id?: string | null
          related_resource_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          processed_by: string | null
          processed_date: string | null
          proof_image: string | null
          request_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          proof_image?: string | null
          request_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          proof_image?: string | null
          request_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          created_at: string
          display_name: string | null
          email: string | null
          experience_points: number
          id: string
          is_active: boolean
          last_login: string | null
          level: number
          phone: string
          preferences: Json | null
          referral_code: string | null
          referred_by: string | null
          role: string
          telegram_id: string | null
          telegram_notif_enabled: boolean | null
          total_wagered: number
          total_won: number
          two_factor_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string | null
          email?: string | null
          experience_points?: number
          id: string
          is_active?: boolean
          last_login?: string | null
          level?: number
          phone: string
          preferences?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          telegram_id?: string | null
          telegram_notif_enabled?: boolean | null
          total_wagered?: number
          total_won?: number
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string | null
          email?: string | null
          experience_points?: number
          id?: string
          is_active?: boolean
          last_login?: string | null
          level?: number
          phone?: string
          preferences?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          telegram_id?: string | null
          telegram_notif_enabled?: boolean | null
          total_wagered?: number
          total_won?: number
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      promotion_usages: {
        Row: {
          created_at: string
          game_round_id: string | null
          id: string
          promotion_id: string
          updated_at: string
          used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_round_id?: string | null
          id?: string
          promotion_id: string
          updated_at?: string
          used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_round_id?: string | null
          id?: string
          promotion_id?: string
          updated_at?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          current_usage_count: number | null
          description: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          max_usage_count: number | null
          min_level: number
          requirements: Json | null
          reward_multiplier: number
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_usage_count?: number | null
          description?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          max_usage_count?: number | null
          min_level?: number
          requirements?: Json | null
          reward_multiplier?: number
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_usage_count?: number | null
          description?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          max_usage_count?: number | null
          min_level?: number
          requirements?: Json | null
          reward_multiplier?: number
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          reward_paid: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          reward_paid?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_paid?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reward_codes: {
        Row: {
          amount: number
          code: string
          created_at: string
          expiry_date: string
          game_round_id: string
          id: string
          is_used: boolean | null
          redeemed_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          code: string
          created_at?: string
          expiry_date: string
          game_round_id: string
          id?: string
          is_used?: boolean | null
          redeemed_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          expiry_date?: string
          game_round_id?: string
          id?: string
          is_used?: boolean | null
          redeemed_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action_type: string
          description: string | null
          id: string
          ip_address: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          description?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          benefits: Json | null
          created_at: string
          experience_required: number
          icon: string | null
          id: number
          level: number
          name: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          experience_required: number
          icon?: string | null
          id?: number
          level: number
          name: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          experience_required?: number
          icon?: string | null
          id?: number
          level?: number
          name?: string
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          biggest_win: number | null
          games_won: number | null
          id: string
          last_updated: string
          lucky_number: string | null
          total_games_played: number | null
          total_rewards: number | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          biggest_win?: number | null
          games_won?: number | null
          id?: string
          last_updated?: string
          lucky_number?: string | null
          total_games_played?: number | null
          total_rewards?: number | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          biggest_win?: number | null
          games_won?: number | null
          id?: string
          last_updated?: string
          lucky_number?: string | null
          total_games_played?: number | null
          total_rewards?: number | null
          user_id?: string
          win_rate?: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
          created_at: string | null
          game_round_id: string
          id: string
          is_winner: boolean | null
          selected_number: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          game_round_id: string
          id?: string
          is_winner?: boolean | null
          selected_number: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          game_round_id?: string
          id?: string
          is_winner?: boolean | null
          selected_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bets_game_round_id_fkey'
            columns: ['game_round_id']
            isOneToOne: false
            referencedRelation: 'game_rounds'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      game_rounds: {
        Row: {
          created_by: string
          end_time: string | null
          id: string
          start_time: string | null
          status: string
          total_bets: number | null
          total_payout: number | null
          winning_number: string | null
        }
        Insert: {
          created_by: string
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          total_bets?: number | null
          total_payout?: number | null
          winning_number?: string | null
        }
        Update: {
          created_by?: string
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          total_bets?: number | null
          total_payout?: number | null
          winning_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'game_rounds_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_resource_id: string | null
          related_resource_type: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_resource_id?: string | null
          related_resource_type?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_resource_id?: string | null
          related_resource_type?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          id: string
          notes: string | null
          processed_by: string | null
          processed_date: string | null
          proof_image: string | null
          request_date: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          proof_image?: string | null
          request_date?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          proof_image?: string | null
          request_date?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payment_requests_processed_by_fkey'
            columns: ['processed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_requests_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          created_at: string | null
          display_name: string | null
          experience_points: number | null
          id: string
          is_active: boolean
          last_login: string | null
          level: number | null
          phone: string | null
          preferences: Json | null
          referral_code: string | null
          referred_by: string | null
          role: string
          telegram_id: string | null
          telegram_notif_enabled: boolean | null
          total_wagered: number | null
          total_won: number | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          created_at?: string | null
          display_name?: string | null
          experience_points?: number | null
          id: string
          is_active?: boolean
          last_login?: string | null
          level?: number | null
          phone?: string | null
          preferences?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          telegram_id?: string | null
          telegram_notif_enabled?: boolean | null
          total_wagered?: number | null
          total_won?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          created_at?: string | null
          display_name?: string | null
          experience_points?: number | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          level?: number | null
          phone?: string | null
          preferences?: Json | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          telegram_id?: string | null
          telegram_notif_enabled?: boolean | null
          total_wagered?: number | null
          total_won?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_referred_by_fkey'
            columns: ['referred_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      promotion_usages: {
        Row: {
          game_round_id: string | null
          id: string
          promotion_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          game_round_id?: string | null
          id?: string
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          game_round_id?: string | null
          id?: string
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'promotion_usages_game_round_id_fkey'
            columns: ['game_round_id']
            isOneToOne: false
            referencedRelation: 'game_rounds'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'promotion_usages_promotion_id_fkey'
            columns: ['promotion_id']
            isOneToOne: false
            referencedRelation: 'promotions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'promotion_usages_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      promotions: {
        Row: {
          created_at: string | null
          current_usage_count: number | null
          description: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          max_usage_count: number | null
          min_level: number | null
          requirements: Json | null
          reward_multiplier: number | null
          starts_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_usage_count?: number | null
          description?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          max_usage_count?: number | null
          min_level?: number | null
          requirements?: Json | null
          reward_multiplier?: number | null
          starts_at: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_usage_count?: number | null
          description?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          max_usage_count?: number | null
          min_level?: number | null
          requirements?: Json | null
          reward_multiplier?: number | null
          starts_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string | null
          referrer_id: string | null
          reward_amount: number | null
          reward_paid: boolean | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_paid?: boolean | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_paid?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'referrals_referred_id_fkey'
            columns: ['referred_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'referrals_referrer_id_fkey'
            columns: ['referrer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      reward_codes: {
        Row: {
          amount: number
          code: string
          expiry_date: string
          game_round_id: string
          id: string
          is_used: boolean | null
          redeemed_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          code: string
          expiry_date: string
          game_round_id: string
          id?: string
          is_used?: boolean | null
          redeemed_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          code?: string
          expiry_date?: string
          game_round_id?: string
          id?: string
          is_used?: boolean | null
          redeemed_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reward_codes_game_round_id_fkey'
            columns: ['game_round_id']
            isOneToOne: false
            referencedRelation: 'game_rounds'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reward_codes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      system_logs: {
        Row: {
          action_type: string
          description: string | null
          id: string
          ip_address: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          description?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'system_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      user_levels: {
        Row: {
          benefits: Json | null
          created_at: string | null
          experience_required: number
          icon: string | null
          id: number
          level: number
          name: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          experience_required: number
          icon?: string | null
          id?: number
          level: number
          name: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
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
          last_updated: string | null
          lucky_number: string | null
          total_games_played: number | null
          total_rewards: number | null
          user_id: string | null
          win_rate: number | null
        }
        Insert: {
          biggest_win?: number | null
          games_won?: number | null
          id?: string
          last_updated?: string | null
          lucky_number?: string | null
          total_games_played?: number | null
          total_rewards?: number | null
          user_id?: string | null
          win_rate?: number | null
        }
        Update: {
          biggest_win?: number | null
          games_won?: number | null
          id?: string
          last_updated?: string | null
          lucky_number?: string | null
          total_games_played?: number | null
          total_rewards?: number | null
          user_id?: string | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_statistics_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_balance: {
        Args: {
          user_id: string
          amount: number
          is_increase: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never

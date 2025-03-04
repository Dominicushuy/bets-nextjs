// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string | null
          telegram_id: string | null
          role: string
          balance: number
          is_active: boolean
          display_name: string | null
          avatar_url: string | null
          level: number | null
          experience_points: number | null
          total_wagered: number | null
          total_won: number | null
          referral_code: string | null
          referred_by: string | null
          preferences: Json | null
          two_factor_enabled: boolean | null
          telegram_notif_enabled: boolean | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          telegram_id?: string | null
          role?: string
          balance?: number
          is_active?: boolean
          display_name?: string | null
          avatar_url?: string | null
          level?: number | null
          experience_points?: number | null
          total_wagered?: number | null
          total_won?: number | null
          referral_code?: string | null
          referred_by?: string | null
          preferences?: Json | null
          two_factor_enabled?: boolean | null
          telegram_notif_enabled?: boolean | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          telegram_id?: string | null
          role?: string
          balance?: number
          is_active?: boolean
          display_name?: string | null
          avatar_url?: string | null
          level?: number | null
          experience_points?: number | null
          total_wagered?: number | null
          total_won?: number | null
          referral_code?: string | null
          referred_by?: string | null
          preferences?: Json | null
          two_factor_enabled?: boolean | null
          telegram_notif_enabled?: boolean | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profiles_referred_by_fkey'
            columns: ['referred_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      game_rounds: {
        Row: {
          id: string
          created_by: string
          start_time: string
          end_time: string | null
          status: string
          winning_number: string | null
          total_bets: number | null
          total_payout: number | null
        }
        Insert: {
          id?: string
          created_by: string
          start_time?: string
          end_time?: string | null
          status?: string
          winning_number?: string | null
          total_bets?: number | null
          total_payout?: number | null
        }
        Update: {
          id?: string
          created_by?: string
          start_time?: string
          end_time?: string | null
          status?: string
          winning_number?: string | null
          total_bets?: number | null
          total_payout?: number | null
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
      bets: {
        Row: {
          id: string
          user_id: string
          game_round_id: string
          selected_number: string
          amount: number
          is_winner: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_round_id: string
          selected_number: string
          amount: number
          is_winner?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_round_id?: string
          selected_number?: string
          amount?: number
          is_winner?: boolean | null
          created_at?: string
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
      payment_requests: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          proof_image: string | null
          request_date: string
          processed_date: string | null
          processed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: string
          proof_image?: string | null
          request_date?: string
          processed_date?: string | null
          processed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          proof_image?: string | null
          request_date?: string
          processed_date?: string | null
          processed_by?: string | null
          notes?: string | null
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
      // Thêm các bảng khác tương tự...
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
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: {
        [key: string]: string
      }
    }
  }
}

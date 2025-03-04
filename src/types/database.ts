// src/types/database.ts
import { Database } from "./supabase";

// Extended Profile type with additional fields
export type ExtendedProfile = Database["public"]["Tables"]["profiles"]["Row"];

// Game Round type
export type GameRound = Database["public"]["Tables"]["game_rounds"]["Row"] & {
  creator?: {
    phone?: string;
  };
};

// Bet type
export type Bet = Database["public"]["Tables"]["bets"]["Row"] & {
  user?: {
    phone?: string;
  };
  game?: GameRound;
};

// Payment Request type
export type PaymentRequest =
  Database["public"]["Tables"]["payment_requests"]["Row"] & {
    profiles?: {
      phone?: string;
    };
    processed_by_profile?: {
      phone?: string;
    };
  };

// User Statistics type
export interface UserStatistics {
  id: string;
  user_id: string;
  total_games_played: number;
  games_won: number;
  win_rate: number;
  biggest_win: number;
  lucky_number?: string;
  total_rewards: number;
  last_updated: string;
}

// User Level type
export interface UserLevel {
  id: number;
  level: number;
  name: string;
  experience_required: number;
  benefits: Record<string, any>;
  icon?: string;
  created_at: string;
}

// Notification type
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "game" | "payment" | "reward" | "system";
  is_read: boolean;
  related_resource_id?: string;
  related_resource_type?: string;
  created_at: string;
  expires_at?: string;
}

// Promotion type
export interface Promotion {
  id: string;
  title: string;
  description?: string;
  reward_multiplier: number;
  min_level: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  requirements?: Record<string, any>;
  max_usage_count?: number;
  current_usage_count: number;
  created_at: string;
  updated_at: string;
}

// Reward Code type
export interface RewardCode {
  id: string;
  code: string;
  user_id: string;
  game_round_id: string;
  amount: number;
  is_used: boolean;
  expiry_date: string;
  redeemed_date?: string;
  user?: {
    id: string;
    phone: string;
  };
  game?: GameRound;
}

// src/services/reward-service.ts
import { supabase } from '@/lib/supabase/client'
import { RewardCode } from '@/types/database'

/**
 * Lấy tất cả các rewards của người dùng
 */
export async function getUserRewards(userId: string): Promise<RewardCode[]> {
  const { data, error } = await supabase
    .from('reward_codes')
    .select(
      `
      *,
      game:game_round_id (
        id,
        status,
        winning_number,
        start_time,
        end_time
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RewardCode[]
}

/**
 * Lấy thông tin chi tiết một reward
 */
export async function getRewardByCode(code: string): Promise<RewardCode> {
  const { data, error } = await supabase
    .from('reward_codes')
    .select(
      `
      *,
      game:game_round_id (
        id,
        status,
        winning_number,
        start_time,
        end_time
      )
    `
    )
    .eq('code', code)
    .single()

  if (error) throw error
  return data as RewardCode
}

/**
 * Lấy thống kê về rewards của người dùng
 */
export async function getRewardStats(userId: string) {
  const { data, error } = await supabase
    .from('reward_codes')
    .select('amount, is_used, expiry_date')
    .eq('user_id', userId)

  if (error) throw error

  // Tính toán các thống kê
  const currentDate = new Date()

  const stats = {
    totalRewards: data.length,
    totalAmount: data.reduce((sum, reward) => sum + reward.amount, 0),
    redeemedCount: data.filter((r) => r.is_used).length,
    pendingCount: data.filter(
      (r) => !r.is_used && new Date(r.expiry_date) > currentDate
    ).length,
    expiredCount: data.filter(
      (r) => !r.is_used && new Date(r.expiry_date) < currentDate
    ).length,
  }

  return stats
}

/**
 * Đổi phần thưởng (Redeem)
 */
export async function redeemReward(code: string, userId: string) {
  // Lấy thông tin reward trước khi đổi
  const { data: reward, error: fetchError } = await supabase
    .from('reward_codes')
    .select('*')
    .eq('code', code)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    throw new Error('Không tìm thấy mã thưởng hoặc mã không thuộc về bạn')
  }

  // Kiểm tra trạng thái reward
  if (reward.is_used) {
    throw new Error('Mã thưởng này đã được sử dụng')
  }

  if (new Date(reward.expiry_date) < new Date()) {
    throw new Error('Mã thưởng này đã hết hạn')
  }

  // Gọi RPC function để đổi thưởng
  const { data, error } = await supabase.rpc('redeem_reward', {
    p_code: code,
    p_user_id: userId,
  })

  if (error) throw error
  return data
}

/**
 * Tạo mã thưởng mới
 */
export async function createReward(
  userId: string,
  gameId: string,
  amount: number,
  expiryDays = 7
) {
  // Gọi function để tạo mã thưởng
  const { data, error } = await supabase.rpc('create_game_reward', {
    p_user_id: userId,
    p_game_id: gameId,
    p_amount: amount,
    p_expiry_days: expiryDays,
  })

  if (error) throw error
  return data
}

/**
 * Kiểm tra tính hợp lệ của mã thưởng
 */
export async function validateRewardCode(code: string, userId: string) {
  try {
    const reward = await getRewardByCode(code)

    // Kiểm tra xem reward có thuộc về user không
    if (reward.user_id !== userId) {
      return {
        isValid: false,
        message: 'Mã thưởng này không thuộc về bạn',
      }
    }

    // Kiểm tra xem reward đã được sử dụng chưa
    if (reward.is_used) {
      return {
        isValid: false,
        message: 'Mã thưởng này đã được sử dụng',
      }
    }

    // Kiểm tra xem reward có hết hạn không
    if (new Date(reward.expiry_date) < new Date()) {
      return {
        isValid: false,
        message: 'Mã thưởng này đã hết hạn',
      }
    }

    return {
      isValid: true,
      message: 'Mã thưởng hợp lệ',
      reward,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Không tìm thấy mã thưởng',
    }
  }
}

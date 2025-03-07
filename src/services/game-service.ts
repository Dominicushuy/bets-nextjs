// src/services/game-service.ts
import { createClient } from '@/lib/supabase/client'
import { GameRound, Bet } from '@/types/database'

// Fetch tất cả lượt chơi với filter
export async function getGameRounds(status?: string, page = 1, limit = 10) {
  const supabase = createClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('game_rounds')
    .select(
      `
      *,
      creator:created_by (phone)
    `,
      { count: 'exact' }
    )
    .order('start_time', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: data as GameRound[],
    pagination: {
      page,
      limit,
      totalRecords: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  }
}

// Fetch chi tiết một lượt chơi
export async function getGameRound(gameId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('game_rounds')
    .select(
      `
      *,
      creator:created_by (phone)
    `
    )
    .eq('id', gameId)
    .single()

  if (error) throw error

  return data as GameRound
}

// Fetch các bets trong một lượt chơi
export async function getGameBets(gameId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bets')
    .select(
      `
      *,
      user:user_id (
        phone
      )
    `
    )
    .eq('game_round_id', gameId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data as Bet[]
}

// Fetch bets của một user
export async function getUserBets(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bets')
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

  return data
}

// Thêm function tạo lượt chơi mới (chỉ admin)
export async function createGameRound(data: Partial<GameRound>) {
  const supabase = createClient()

  const { data: newGame, error } = await supabase
    .from('game_rounds')
    .insert({
      created_by: data.created_by || '',
      start_time: data.start_time || new Date().toISOString(),
      status: data.status || 'pending',
    })
    .select()
    .single()

  if (error) throw error

  return newGame as GameRound
}

// Fetch chi tiết một lượt chơi với tất cả thông tin liên quan
export async function getGameRoundDetails(gameId: string, userId: string) {
  const supabase = createClient()

  // Lấy thông tin game
  const { data: gameRound, error: gameError } = await supabase
    .from('game_rounds')
    .select(
      `
      *,
      creator:created_by (phone)
    `
    )
    .eq('id', gameId)
    .single()

  if (gameError) throw gameError

  // Lấy thông tin các bets trong game này
  const { data: bets, error: betsError } = await supabase
    .from('bets')
    .select(
      `
      *,
      user:user_id (
        phone
      )
    `
    )
    .eq('game_round_id', gameId)
    .order('created_at', { ascending: false })

  if (betsError) throw betsError

  // Lấy thông tin bets của user hiện tại
  const { data: userBets, error: userBetsError } = await supabase
    .from('bets')
    .select('*')
    .eq('game_round_id', gameId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (userBetsError) throw userBetsError

  // Lấy thông tin profile của user để biết số dư
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', userId)
    .single()

  if (profileError) throw profileError

  return {
    gameRound,
    bets,
    userBets,
    userBalance: profile.balance,
  }
}

// Đặt cược
export async function placeBet(
  userId: string,
  gameRoundId: string,
  selectedNumber: string,
  amount: number
) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('place_bet', {
    p_user_id: userId,
    p_game_round_id: gameRoundId,
    p_selected_number: selectedNumber,
    p_amount: amount,
  })

  if (error) throw error

  if (data.success === false) {
    throw new Error(data.message)
  }

  return data
}

/**
 * Kết thúc lượt chơi (admin only)
 */
export async function completeGameRound(gameId: string, winningNumber: string) {
  const supabase = createClient()

  // Gọi RPC function để hoàn thành lượt chơi
  const { data, error } = await supabase.rpc('complete_game_round', {
    p_game_id: gameId,
    p_winning_number: winningNumber,
    p_admin_id: (await supabase.auth.getUser()).data.user?.id,
  })

  if (error) throw error
  return data
}

/**
 * Lấy kết quả lượt chơi
 */
export async function getGameResults(gameId: string) {
  const response = await fetch(`/api/game-rounds/${gameId}/results`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error fetching game results')
  }

  return await response.json()
}

/**
 * Đổi phần thưởng
 */
export async function redeemReward(code: string) {
  const response = await fetch(`/api/rewards/${code}/redeem`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error redeeming reward')
  }

  return await response.json()
}

/**
 * Lấy cược của user trong một game cụ thể
 */
export async function getUserBetsInGame(userId: string, gameId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('game_round_id', gameId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Lấy thống kê bet của một game
 */
export async function getBetStats(gameId: string) {
  const response = await fetch(`/api/game-rounds/${gameId}/bet-stats`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error fetching bet stats')
  }

  return await response.json()
}

/**
 * Lấy danh sách người thắng của một lượt chơi
 */
export async function getWinners(gameId: string) {
  const response = await fetch(`/api/game-rounds/${gameId}/winners`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error fetching winners')
  }

  return await response.json()
}

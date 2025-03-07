// src/app/api/game-rounds/[id]/results/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id
  const supabase = createRouteHandlerClient({ cookies })

  // Kiểm tra người dùng đã đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Lấy thông tin game round
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

    if (gameError) {
      return NextResponse.json(
        { error: gameError.message || 'Error fetching game round' },
        { status: 500 }
      )
    }

    if (!gameRound) {
      return NextResponse.json(
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Kiểm tra xem game đã hoàn thành chưa
    if (gameRound.status !== 'completed') {
      return NextResponse.json(
        { error: 'Game round is not completed yet' },
        { status: 400 }
      )
    }

    // Lấy thống kê game
    const { data: gameStats, error: statsError } = await supabase.rpc(
      'get_game_stats',
      {
        p_game_id: gameId,
      }
    )

    if (statsError) {
      return NextResponse.json(
        { error: statsError.message || 'Error fetching game stats' },
        { status: 500 }
      )
    }

    // Kiểm tra xem người dùng có thắng không
    const { data: userBets, error: betsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)
      .eq('is_winner', true)

    if (betsError) {
      return NextResponse.json(
        { error: betsError.message || 'Error fetching user bets' },
        { status: 500 }
      )
    }

    const isWinner = userBets && userBets.length > 0
    let totalWinAmount = 0

    // Tính tổng tiền thắng của người dùng
    if (isWinner) {
      totalWinAmount = userBets.reduce((sum, bet) => sum + bet.amount * 80, 0)
    }

    // Đánh dấu đã đọc cho các thông báo liên quan đến lượt chơi này
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('related_resource_id', gameId)
      .eq('related_resource_type', 'game_round')
      .eq('is_read', false)

    // Lấy thông tin các mã thưởng nếu người dùng thắng
    let rewards = []
    if (isWinner) {
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('reward_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_round_id', gameId)

      if (!rewardsError && rewardsData) {
        rewards = rewardsData
      }
    }

    // Tổng hợp kết quả
    const result = {
      gameRound,
      stats: {
        totalPlayers: gameStats.totalPlayers || 0,
        totalWinners: gameStats.totalWinners || 0,
        totalBets: gameStats.totalBets || 0,
        totalPayout: gameStats.totalPayout || 0,
        winRate: gameStats.winRate || 0,
      },
      isWinner,
      totalWinAmount,
      rewards,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching game results:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game results' },
      { status: 500 }
    )
  }
}

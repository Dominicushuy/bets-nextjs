// src/app/api/game-rounds/[id]/winners/route.ts
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
      .select('*')
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

    // Lấy danh sách người thắng
    const { data: winners, error: winnersError } = await supabase
      .from('bets')
      .select(
        `
        *,
        user:user_id (
          id,
          phone,
          level,
          display_name
        )
      `
      )
      .eq('game_round_id', gameId)
      .eq('is_winner', true)
      .order('amount', { ascending: false })

    if (winnersError) {
      return NextResponse.json(
        { error: winnersError.message || 'Error fetching winners' },
        { status: 500 }
      )
    }

    // Lấy thông tin về tổng số người chơi và tổng số cược
    const { data: betStats, error: betStatsError } = await supabase
      .from('bets')
      .select('user_id, amount', { count: 'exact' })
      .eq('game_round_id', gameId)

    if (betStatsError) {
      return NextResponse.json(
        { error: betStatsError.message || 'Error fetching bet statistics' },
        { status: 500 }
      )
    }

    // Tính toán thống kê
    const uniquePlayers = new Set(betStats.map((bet) => bet.user_id)).size
    const totalBets = betStats.reduce((sum, bet) => sum + bet.amount, 0)
    const totalWinners = winners.length
    const totalPayout = winners.reduce(
      (sum, winner) => sum + winner.amount * 80,
      0
    )

    // Map winners với số tiền thắng
    const winnersWithAmounts = winners.map((winner) => ({
      ...winner,
      winAmount: winner.amount * 80,
    }))

    // Tổng hợp kết quả
    const result = {
      gameRound,
      winners: winnersWithAmounts,
      stats: {
        totalPlayers: uniquePlayers,
        totalBets,
        totalWinners,
        totalPayout,
        winRate: uniquePlayers > 0 ? (totalWinners / uniquePlayers) * 100 : 0,
      },
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching winners:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching winners' },
      { status: 500 }
    )
  }
}

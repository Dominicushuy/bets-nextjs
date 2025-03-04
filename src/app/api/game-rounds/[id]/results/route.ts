// src/app/api/game-rounds/[id]/results/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy thông tin lượt chơi
    const { data: gameRound, error: gameError } = await supabase
      .from('game_rounds')
      .select('*, creator:created_by (phone)')
      .eq('id', gameId)
      .single()

    if (gameError) {
      return NextResponse.json(
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Nếu lượt chơi chưa hoàn thành, trả về lỗi
    if (gameRound.status !== 'completed') {
      return NextResponse.json(
        { error: 'Game round is not completed yet' },
        { status: 400 }
      )
    }

    // Lấy thông tin thắng thua của người dùng hiện tại
    const { data: userBets, error: userBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)

    if (userBetsError) {
      return NextResponse.json(
        { error: 'Error fetching user bets' },
        { status: 500 }
      )
    }

    // Lấy thông tin phần thưởng (nếu có)
    const { data: rewards, error: rewardsError } = await supabase
      .from('reward_codes')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)

    if (rewardsError) {
      return NextResponse.json(
        { error: 'Error fetching rewards' },
        { status: 500 }
      )
    }

    // Tính tổng tiền thắng
    const totalWinAmount =
      rewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0

    // Kiểm tra người dùng có thắng không
    const hasWinningBets =
      userBets?.some((bet) => bet.is_winner === true) || false

    // Lấy số liệu tổng hợp
    const { data: stats, error: statsError } = await supabase.rpc(
      'get_game_stats',
      { p_game_id: gameId }
    )

    if (statsError) {
      console.error('Error fetching game stats:', statsError)
    }

    return NextResponse.json({
      gameRound,
      userBets: userBets || [],
      rewards: rewards || [],
      isWinner: hasWinningBets,
      totalWinAmount,
      stats: stats || {
        totalPlayers: 0,
        totalWinners: 0,
        totalBets: gameRound.total_bets || 0,
        totalPayout: gameRound.total_payout || 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching game results:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game results' },
      { status: 500 }
    )
  }
}

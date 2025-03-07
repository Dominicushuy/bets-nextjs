// src/app/api/game-rounds/[id]/results/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id

  try {
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy thông tin game round và kiểm tra xem nó đã hoàn thành chưa
    const { data: gameRound, error: gameError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('id', gameId)
      .single()

    if (gameError) {
      return NextResponse.json(
        { error: gameError.message || 'Game round not found' },
        { status: 404 }
      )
    }

    if (gameRound.status !== 'completed') {
      return NextResponse.json(
        { error: 'Game round is not completed yet' },
        { status: 400 }
      )
    }

    // Lấy thông số thống kê trò chơi
    const { data: gameStats, error: statsError } = await supabase.rpc(
      'get_game_stats',
      { p_game_id: gameId }
    )

    if (statsError) {
      return NextResponse.json(
        { error: statsError.message || 'Error fetching game statistics' },
        { status: 500 }
      )
    }

    // Kiểm tra xem người dùng hiện tại có thắng hay không
    const { data: winningBets, error: winningBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)
      .eq('is_winner', true)

    if (winningBetsError) {
      return NextResponse.json(
        { error: winningBetsError.message || 'Error checking winner status' },
        { status: 500 }
      )
    }

    const isWinner = winningBets && winningBets.length > 0

    // Tính tổng tiền thắng
    let totalWinAmount = 0
    if (isWinner) {
      totalWinAmount = winningBets.reduce(
        (sum, bet) => sum + bet.amount * 80, // Hệ số trả thưởng 80
        0
      )
    }

    // Lấy danh sách phần thưởng của người dùng (nếu có)
    const { data: rewards, error: rewardsError } = await supabase
      .from('reward_codes')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)

    if (rewardsError) {
      return NextResponse.json(
        { error: rewardsError.message || 'Error fetching rewards' },
        { status: 500 }
      )
    }

    // Đánh dấu thông báo liên quan đến game này là đã đọc
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('related_resource_id', gameId)
      .eq('related_resource_type', 'game_round')
      .eq('user_id', user.id)

    // Trả về kết quả đầy đủ
    return NextResponse.json({
      gameRound,
      isWinner,
      totalWinAmount,
      stats: {
        totalPlayers: gameStats.totalPlayers || 0,
        totalWinners: gameStats.totalWinners || 0,
        totalBets: gameStats.totalBets || 0,
        totalPayout: gameStats.totalPayout || 0,
      },
      rewards,
    })
  } catch (error: any) {
    console.error('Error fetching game results:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game results' },
      { status: 500 }
    )
  }
}

// src/app/api/game-rounds/[id]/results/route.ts - cập nhật
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

    // Lấy tất cả lượt đặt cược trong game này
    const { data: allBets, error: allBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)

    if (allBetsError) {
      console.error('Error fetching all bets:', allBetsError)
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
      console.error('Error fetching rewards:', rewardsError)
    }

    // Tính tổng tiền thắng
    const totalWinAmount =
      rewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0

    // Kiểm tra người dùng có thắng không
    const hasWinningBets =
      userBets?.some((bet) => bet.is_winner === true) || false

    // Tổng số người chơi và người thắng
    const totalPlayers = [...new Set(allBets?.map((bet) => bet.user_id) || [])]
      .length
    const totalWinners = [
      ...new Set(
        allBets?.filter((bet) => bet.is_winner)?.map((bet) => bet.user_id) || []
      ),
    ].length

    // Lấy số liệu tổng hợp từ function SQL hoặc tính toán thủ công nếu function chưa có
    let stats
    try {
      const { data: statsData, error: statsError } = await supabase.rpc(
        'get_game_stats',
        { p_game_id: gameId }
      )

      if (statsError) {
        throw statsError
      }

      stats = statsData
    } catch (error) {
      console.error(
        'Error calling get_game_stats, using manual calculation:',
        error
      )
      // Tính toán thủ công
      stats = {
        totalPlayers,
        totalWinners,
        totalBets: gameRound.total_bets || 0,
        totalPayout: gameRound.total_payout || 0,
      }
    }

    // Lấy 3 lượt chơi gần nhất đang diễn ra (cho "Lượt chơi khác" section)
    const { data: activeGames, error: activeGamesError } = await supabase
      .from('game_rounds')
      .select('id, start_time, total_bets, status')
      .eq('status', 'active')
      .order('start_time', { ascending: false })
      .limit(3)

    if (activeGamesError) {
      console.error('Error fetching active games:', activeGamesError)
    }

    return NextResponse.json({
      gameRound,
      userBets: userBets || [],
      rewards: rewards || [],
      isWinner: hasWinningBets,
      totalWinAmount,
      stats: stats || {
        totalPlayers,
        totalWinners,
        totalBets: gameRound.total_bets || 0,
        totalPayout: gameRound.total_payout || 0,
      },
      activeGames: activeGames || [],
    })
  } catch (error: any) {
    console.error('Error fetching game results:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game results' },
      { status: 500 }
    )
  }
}

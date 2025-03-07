// src/app/api/statistics/user/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy tham số từ query
    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'all'

    // Kiểm tra period hợp lệ
    if (!['week', 'month', 'all'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be week, month, or all' },
        { status: 400 }
      )
    }

    // Lấy thống kê từ bảng user_statistics
    const { data: stats, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 500 })
    }

    // Chỉ lấy dữ liệu đặt cược gần đây nếu period không phải 'all'
    if (period !== 'all') {
      // Xác định thời gian dựa trên period
      const days = period === 'week' ? 7 : 30
      const timeConstraint = new Date()
      timeConstraint.setDate(timeConstraint.getDate() - days)

      // Lấy dữ liệu đặt cược trong khoảng thời gian
      const { data: recentBets, error: recentBetsError } = await supabase
        .from('bets')
        .select('id, amount, is_winner')
        .eq('user_id', user.id)
        .gte('created_at', timeConstraint.toISOString())

      if (recentBetsError) {
        return NextResponse.json(
          { error: recentBetsError.message },
          { status: 500 }
        )
      }

      // Tính toán thống kê
      const totalBets = recentBets?.length || 0
      const winningBets = recentBets?.filter((bet) => bet.is_winner).length || 0
      const periodWinRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0
      const recentTotalAmount =
        recentBets?.reduce((sum, bet) => sum + (bet.amount || 0), 0) || 0

      return NextResponse.json({
        allTime: {
          gamesPlayed: stats.total_games_played,
          gamesWon: stats.games_won,
          winRate: stats.win_rate,
          biggestWin: stats.biggest_win,
          luckyNumber: stats.lucky_number,
          totalRewards: stats.total_rewards,
        },
        recent: {
          period,
          gamesPlayed: totalBets,
          gamesWon: winningBets,
          winRate: periodWinRate,
          totalAmount: recentTotalAmount,
        },
      })
    }

    // Trả về chỉ thống kê tổng hợp
    return NextResponse.json({
      allTime: {
        gamesPlayed: stats.total_games_played,
        gamesWon: stats.games_won,
        winRate: stats.win_rate,
        biggestWin: stats.biggest_win,
        luckyNumber: stats.lucky_number,
        totalRewards: stats.total_rewards,
      },
      recent: {
        period: 'all',
        gamesPlayed: stats.total_games_played,
        gamesWon: stats.games_won,
        winRate: stats.win_rate,
        totalAmount: stats.total_games_played > 0 ? stats.biggest_win : 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching user statistics' },
      { status: 500 }
    )
  }
}

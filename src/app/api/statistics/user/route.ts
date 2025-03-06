// src/app/api/statistics/user/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // Lấy thông tin người dùng đang đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Lấy thông tin thống kê người dùng
    const { data: statistics, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError
    }

    // Nếu chưa có thống kê, tạo thống kê mới
    if (!statistics) {
      // Lấy thông tin tổng số lượt chơi
      const { count: totalGames } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Lấy thông tin số lượt thắng
      const { count: gamesWon } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_winner', true)

      // Lấy thông tin bet lớn nhất đã thắng
      const { data: biggestWin } = await supabase
        .from('bets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('is_winner', true)
        .order('amount', { ascending: false })
        .limit(1)

      // Tính toán số may mắn
      const { data: numberCounts } = await supabase
        .from('bets')
        .select('selected_number, count(*)')
        .eq('user_id', user.id)
        .eq('is_winner', true)
        .group('selected_number')
        .order('count', { ascending: false })
        .limit(1)

      const winRate = totalGames ? ((gamesWon || 0) / totalGames) * 100 : 0
      const biggestWinAmount = biggestWin?.[0]?.amount || 0
      const luckyNumber = numberCounts?.[0]?.selected_number || null

      // Tạo thống kê mới
      const defaultStats = {
        user_id: user.id,
        total_games_played: totalGames || 0,
        games_won: gamesWon || 0,
        win_rate: winRate,
        biggest_win: biggestWinAmount,
        lucky_number: luckyNumber,
        total_rewards: 0,
        last_updated: new Date().toISOString(),
      }

      return NextResponse.json({ data: defaultStats })
    }

    // Nếu đã có thống kê, trả về thông tin thống kê
    return NextResponse.json({ data: statistics })
  } catch (error: any) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching user statistics' },
      { status: 500 }
    )
  }
}

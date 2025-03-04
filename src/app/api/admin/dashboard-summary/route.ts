// src/app/api/admin/dashboard-summary/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()

    // Kiểm tra xác thực và quyền admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Lấy tổng số người dùng
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Lấy số user active trong 30 ngày
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activeUsers } = await supabase
      .from('bets')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('user_id')

    const uniqueActiveUsers = new Set(activeUsers?.map((bet) => bet.user_id))
      .size

    // Lấy số payment request pending
    const { count: pendingPayments } = await supabase
      .from('payment_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Lấy số lượt chơi active
    const { count: activeGames } = await supabase
      .from('game_rounds')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Lấy số lượt chơi completed
    const { count: completedGames } = await supabase
      .from('game_rounds')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Lấy tổng tiền đặt cược
    const { data: totalBetsData } = await supabase.from('bets').select('amount')

    const totalBets =
      totalBetsData?.reduce((sum, bet) => sum + (bet.amount || 0), 0) || 0

    // Lấy tổng tiền thưởng
    const { data: totalPayoutsData } = await supabase
      .from('reward_codes')
      .select('amount')

    const totalPayouts =
      totalPayoutsData?.reduce(
        (sum, reward) => sum + (reward.amount || 0),
        0
      ) || 0

    // Lấy số người đăng ký hôm nay
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: registrationsToday } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    return NextResponse.json({
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: uniqueActiveUsers || 0,
        pendingPayments: pendingPayments || 0,
        activeGames: activeGames || 0,
        completedGames: completedGames || 0,
        totalBets,
        totalPayouts,
        profit: totalBets - totalPayouts,
        registrationsToday: registrationsToday || 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching dashboard data' },
      { status: 500 }
    )
  }
}

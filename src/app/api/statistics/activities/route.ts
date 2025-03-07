// src/app/api/statistics/activities/route.ts
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
    const days = parseInt(url.searchParams.get('days') || '30')
    const limit = parseInt(url.searchParams.get('limit') || '30')

    // Sử dụng hàm get_user_activity_stats để lấy thống kê
    const { data: activityStats, error: activityError } = await supabase.rpc(
      'get_user_activity_stats',
      { p_user_id: user.id, p_days: days }
    )

    if (activityError) {
      return NextResponse.json(
        { error: activityError.message },
        { status: 500 }
      )
    }

    // Lấy các hoạt động gần đây từ bảng bets
    const { data: recentBets, error: recentBetsError } = await supabase
      .from('bets')
      .select(
        `
        id,
        amount,
        selected_number,
        is_winner,
        created_at,
        game_round:game_round_id (
          id,
          winning_number,
          status
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (recentBetsError) {
      return NextResponse.json(
        { error: recentBetsError.message },
        { status: 500 }
      )
    }

    // Lấy thông tin rewards gần đây
    const { data: recentRewards, error: rewardsError } = await supabase
      .from('reward_codes')
      .select('id, code, amount, is_used, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (rewardsError) {
      return NextResponse.json({ error: rewardsError.message }, { status: 500 })
    }

    // Lấy thông tin payment requests gần đây
    const { data: recentPayments, error: paymentsError } = await supabase
      .from('payment_requests')
      .select('id, amount, status, request_date')
      .eq('user_id', user.id)
      .order('request_date', { ascending: false })
      .limit(limit)

    if (paymentsError) {
      return NextResponse.json(
        { error: paymentsError.message },
        { status: 500 }
      )
    }

    // Kết hợp tất cả thành timeline hoạt động
    const activities = [
      ...recentBets.map((bet) => ({
        id: bet.id,
        type: 'bet',
        amount: bet.amount,
        details: {
          selectedNumber: bet.selected_number,
          isWinner: bet.is_winner,
          winningNumber: bet.game_round?.winning_number,
        },
        timestamp: bet.created_at,
      })),
      ...recentRewards.map((reward) => ({
        id: reward.id,
        type: 'reward',
        amount: reward.amount,
        details: {
          code: reward.code,
          isUsed: reward.is_used,
        },
        timestamp: reward.created_at,
      })),
      ...recentPayments.map((payment) => ({
        id: payment.id,
        type: 'payment',
        amount: payment.amount,
        details: {
          status: payment.status,
        },
        timestamp: payment.request_date,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)

    return NextResponse.json({
      statistics: activityStats,
      activities,
      recentBets,
      recentRewards,
      recentPayments,
    })
  } catch (error: any) {
    console.error('Error fetching user activities:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching user activities' },
      { status: 500 }
    )
  }
}

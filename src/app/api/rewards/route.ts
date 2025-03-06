// src/app/api/rewards/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  // Lấy thông tin người dùng đang đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // available, used, expired, all
    const limit = parseInt(searchParams.get('limit') || '50')
    const currentDate = new Date().toISOString()

    // Xây dựng query
    let query = supabase
      .from('reward_codes')
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Lọc theo trạng thái nếu có
    if (status) {
      if (status === 'available') {
        query = query.eq('is_used', false).gt('expiry_date', currentDate)
      } else if (status === 'used') {
        query = query.eq('is_used', true)
      } else if (status === 'expired') {
        query = query.eq('is_used', false).lt('expiry_date', currentDate)
      }
    }

    const { data, error } = await query

    if (error) throw error

    // Lấy tổng thống kê
    const { data: statsData, error: statsError } = await supabase
      .from('reward_codes')
      .select('amount, is_used, expiry_date')
      .eq('user_id', user.id)

    if (statsError) throw statsError

    // Tính toán thống kê
    const stats = {
      totalRewards: statsData.length,
      totalAmount: statsData.reduce((sum, reward) => sum + reward.amount, 0),
      redeemedCount: statsData.filter((r) => r.is_used).length,
      pendingCount: statsData.filter(
        (r) => !r.is_used && new Date(r.expiry_date) > new Date()
      ).length,
      expiredCount: statsData.filter(
        (r) => !r.is_used && new Date(r.expiry_date) < new Date()
      ).length,
    }

    return NextResponse.json({ data, stats })
  } catch (error: any) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching rewards' },
      { status: 500 }
    )
  }
}

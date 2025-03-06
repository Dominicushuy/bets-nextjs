// src/app/api/history/route.ts
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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Lấy lịch sử đặt cược
    const betsPromise = supabase
      .from('bets')
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
      .range(offset, offset + limit - 1)

    // Lấy lịch sử thanh toán
    const paymentsPromise = supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('request_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Lấy tổng số lượng để phân trang
    const betsCountPromise = supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const paymentsCountPromise = supabase
      .from('payment_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Chỉ lấy dữ liệu theo loại
    let betsData = [],
      paymentsData = []
    let betsCount = 0,
      paymentsCount = 0

    if (type === 'all' || type === 'bets') {
      const {
        data: bets,
        error: betsError,
        count: betsTotalCount,
      } = await betsPromise
      if (betsError) throw betsError
      betsData = bets || []
      betsCount = betsTotalCount || 0
    }

    if (type === 'all' || type === 'payments') {
      const {
        data: payments,
        error: paymentsError,
        count: paymentsTotalCount,
      } = await paymentsPromise
      if (paymentsError) throw paymentsError
      paymentsData = payments || []
      paymentsCount = paymentsTotalCount || 0
    }

    // Phân trang
    const pagination = {
      page,
      limit,
      totalPages: {
        bets: Math.ceil(betsCount / limit),
        payments: Math.ceil(paymentsCount / limit),
      },
      totalRecords: {
        bets: betsCount,
        payments: paymentsCount,
      },
    }

    return NextResponse.json({
      data: {
        bets: betsData,
        payments: paymentsData,
      },
      pagination,
    })
  } catch (error: any) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching history' },
      { status: 500 }
    )
  }
}

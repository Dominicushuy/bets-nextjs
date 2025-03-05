// src/app/api/game-rounds/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)

    // Lấy tham số từ query string
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Xây dựng query
    let query = supabase
      .from('game_rounds')
      .select(
        `
        *,
        creator:created_by (phone)
      `
      )
      .order('start_time', { ascending: false })

    // Thêm điều kiện lọc theo status nếu có
    if (status) {
      query = query.eq('status', status)
    }

    // Thêm phân trang
    query = query.range(offset, offset + limit - 1)

    // Thực hiện query
    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Lấy tổng số lượng records để tính toán phân trang
    const { count: totalCount } = await supabase
      .from('game_rounds')
      .select('*', { count: 'exact', head: true })
      .eq('status', status || '') // Điều kiện filter nếu có

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        totalRecords: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching game rounds:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game rounds' },
      { status: 500 }
    )
  }
}

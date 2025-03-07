// src/app/api/game-rounds/active/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)

    // Lấy tham số từ query string
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Xây dựng query để lấy các lượt chơi đang diễn ra
    const query = supabase
      .from('game_rounds')
      .select(
        `
        *,
        creator:created_by (phone)
      `,
        { count: 'exact' }
      )
      .eq('status', 'active')
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1)

    // Thực hiện query
    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        totalRecords: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching active game rounds:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching active game rounds' },
      { status: 500 }
    )
  }
}

// src/app/api/admin/games/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can access this endpoint' },
        { status: 403 }
      )
    }

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
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    // Thêm điều kiện lọc theo status nếu có
    if (status) {
      query = query.eq('status', status)
    }

    // Thêm phân trang
    query = query.range(offset, offset + limit - 1)

    // Thực hiện query
    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error fetching game rounds' },
        { status: 500 }
      )
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
    console.error('Error fetching game rounds:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game rounds' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
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

    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can create game rounds' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { start_time, status = 'pending' } = body

    if (!start_time) {
      return NextResponse.json(
        { error: 'Start time is required' },
        { status: 400 }
      )
    }

    // Validate status
    if (status && !['pending', 'active'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Only pending or active is allowed' },
        { status: 400 }
      )
    }

    // Create new game round
    const { data: newGame, error: createError } = await supabase
      .from('game_rounds')
      .insert({
        created_by: user.id,
        start_time,
        status,
      })
      .select('*')
      .single()

    if (createError) {
      return NextResponse.json(
        { error: createError.message || 'Error creating game round' },
        { status: 500 }
      )
    }

    // Log action
    await supabase.from('system_logs').insert({
      action_type: 'game_created',
      description: `Game round ${newGame.id} created by admin ${user.id}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ data: newGame })
  } catch (error: any) {
    console.error('Error creating game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating game round' },
      { status: 500 }
    )
  }
}

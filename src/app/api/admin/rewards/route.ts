// src/app/api/admin/rewards/route.ts
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
    const userId = searchParams.get('user_id')
    const gameId = searchParams.get('game_id')
    const isUsed = searchParams.get('is_used')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Xây dựng query
    let query = supabase
      .from('reward_codes')
      .select(
        `
        *,
        user:user_id (id, phone, display_name),
        game:game_round_id (id, status, winning_number)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    // Thêm các điều kiện lọc
    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (gameId) {
      query = query.eq('game_round_id', gameId)
    }

    if (isUsed !== null) {
      query = query.eq('is_used', isUsed === 'true')
    }

    // Thêm phân trang
    query = query.range(offset, offset + limit - 1)

    // Thực hiện query
    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error fetching rewards' },
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
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching rewards' },
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
        { error: 'Only admin can create rewards' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { userId, gameId, amount, expiryDays = 7 } = body

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Kiểm tra người dùng tồn tại
    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Tạo reward code
    const { data: newReward, error: createError } = await supabase.rpc(
      'create_game_reward',
      {
        p_user_id: userId,
        p_game_id: gameId || null,
        p_amount: amount,
        p_expiry_days: expiryDays,
      }
    )

    if (createError) {
      return NextResponse.json(
        { error: createError.message || 'Error creating reward' },
        { status: 500 }
      )
    }

    // Ghi log action
    await supabase.from('system_logs').insert({
      action_type: 'reward_created',
      description: `Admin created reward of ${amount} VND for user ${userId}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    // Lấy thông tin reward vừa tạo
    const { data: rewardData, error: fetchError } = await supabase
      .from('reward_codes')
      .select('*')
      .eq('code', newReward)
      .single()

    if (fetchError) {
      console.error('Error fetching created reward:', fetchError)
    }

    return NextResponse.json({
      message: 'Reward created successfully',
      data: rewardData || { code: newReward },
    })
  } catch (error: any) {
    console.error('Error creating reward:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating reward' },
      { status: 500 }
    )
  }
}

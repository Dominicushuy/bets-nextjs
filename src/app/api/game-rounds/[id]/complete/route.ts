// src/app/api/game-rounds/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id
  const supabase = createRouteHandlerClient({ cookies })

  // Kiểm tra người dùng đã đăng nhập và có quyền admin
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
      { error: 'Only admin can complete game rounds' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { winningNumber } = body

    if (!winningNumber) {
      return NextResponse.json(
        { error: 'Winning number is required' },
        { status: 400 }
      )
    }

    // Validate winning number format (chỉ chấp nhận số nguyên dương)
    if (!/^\d+$/.test(winningNumber)) {
      return NextResponse.json(
        { error: 'Winning number must be a positive integer' },
        { status: 400 }
      )
    }

    // Gọi RPC function để hoàn thành lượt chơi
    const { data, error } = await supabase.rpc('complete_game_round', {
      p_game_id: gameId,
      p_winning_number: winningNumber,
      p_admin_id: user.id,
    })

    if (error) {
      console.error('Error completing game round:', error)
      return NextResponse.json(
        { error: error.message || 'Error completing game round' },
        { status: 500 }
      )
    }

    // Ghi log hành động
    await supabase.from('system_logs').insert({
      action_type: 'game_completed',
      description: `Admin completed game round ${gameId} with winning number ${winningNumber}`,
      user_id: user.id,
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error completing game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error completing game round' },
      { status: 500 }
    )
  }
}

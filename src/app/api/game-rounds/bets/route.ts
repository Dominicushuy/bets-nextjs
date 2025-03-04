import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    const { gameRoundId, selectedNumber, amount } = body

    if (!gameRoundId || !selectedNumber || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Kiểm tra game có đang active
    const { data: gameRound, error: gameError } = await supabase
      .from('game_rounds')
      .select('status')
      .eq('id', gameRoundId)
      .single()

    if (gameError) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    if (gameRound.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 })
    }

    // Kiểm tra số dư của user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (profile.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Trừ số dư
    const { error: rpcError } = await supabase.rpc('update_user_balance', {
      user_id: user.id,
      amount,
      is_increase: false,
    })

    if (rpcError) {
      return NextResponse.json(
        { error: 'Error updating balance' },
        { status: 500 }
      )
    }

    // Tạo bet
    const { data, error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        game_round_id: gameRoundId,
        selected_number: selectedNumber,
        amount,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      // Nếu có lỗi, hoàn trả lại tiền cho user
      await supabase.rpc('update_user_balance', {
        user_id: user.id,
        amount,
        is_increase: true,
      })

      throw error
    }

    // Cập nhật tổng số tiền đặt cược
    await supabase
      .from('game_rounds')
      .update({
        total_bets: supabase.rpc('increment', { x: amount }),
      })
      .eq('id', gameRoundId)

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error placing bet:', error)
    return NextResponse.json(
      { error: error.message || 'Error placing bet' },
      { status: 500 }
    )
  }
}

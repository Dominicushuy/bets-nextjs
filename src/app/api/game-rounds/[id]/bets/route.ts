// src/app/api/game-rounds/[id]/bets/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng đang đăng nhập
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { selectedNumber, amount } = body

    // Validate request data
    if (!selectedNumber || selectedNumber.trim() === '') {
      return NextResponse.json(
        { error: 'Selected number is required' },
        { status: 400 }
      )
    }

    if (!/^\d+$/.test(selectedNumber)) {
      return NextResponse.json(
        { error: 'Selected number must be a positive integer' },
        { status: 400 }
      )
    }

    if (!amount) {
      return NextResponse.json(
        { error: 'Bet amount is required' },
        { status: 400 }
      )
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    if (amount < 10000) {
      return NextResponse.json(
        { error: 'Minimum bet amount is 10,000 VND' },
        { status: 400 }
      )
    }

    // Gọi function place_bet
    const { data, error } = await supabase.rpc('place_bet', {
      p_user_id: user.id,
      p_game_round_id: gameId,
      p_selected_number: selectedNumber,
      p_amount: amount,
    })

    if (error) {
      console.error('Error placing bet:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to place bet' },
        { status: 500 }
      )
    }

    if (!data.success) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    // Log system action
    await supabase.from('system_logs').insert({
      action_type: 'bet_placed',
      description: `User ${user.id} placed a bet of ${amount} VND on number ${selectedNumber} for game ${gameId}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      data,
      message: 'Bet placed successfully',
      betAmount: amount,
      selectedNumber,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error in place bet API:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing bet' },
      { status: 500 }
    )
  }
}

// src/app/api/game-rounds/bets/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { gameRoundId, selectedNumber, amount } = body

    if (!gameRoundId || !selectedNumber || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Gọi function place_bet
    const { data, error } = await supabase.rpc('place_bet', {
      p_user_id: user.id,
      p_game_round_id: gameRoundId,
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

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in place bet API:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing bet' },
      { status: 500 }
    )
  }
}

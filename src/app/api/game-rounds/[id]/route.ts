// src/app/api/game-rounds/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id

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

    // Lấy thông tin game round
    const { data: gameRound, error: gameError } = await supabase
      .from('game_rounds')
      .select(
        `
        *,
        creator:created_by (phone)
      `
      )
      .eq('id', gameId)
      .single()

    if (gameError) {
      return NextResponse.json(
        { error: gameError.message || 'Game round not found' },
        { status: 404 }
      )
    }

    // Lấy danh sách các bets của game round này
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select(
        `
        *,
        user:user_id (
          phone
        )
      `
      )
      .eq('game_round_id', gameId)
      .order('created_at', { ascending: false })

    if (betsError) {
      return NextResponse.json(
        { error: betsError.message || 'Error fetching bets' },
        { status: 500 }
      )
    }

    // Lấy thông tin các bets của user hiện tại
    const { data: userBets, error: userBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (userBetsError) {
      return NextResponse.json(
        { error: userBetsError.message || 'Error fetching user bets' },
        { status: 500 }
      )
    }

    // Lấy thông tin profile của user để biết số dư
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message || 'Error fetching user profile' },
        { status: 500 }
      )
    }

    // Trả về đầy đủ thông tin
    return NextResponse.json({
      gameRound,
      bets,
      userBets,
      userBalance: userProfile.balance,
    })
  } catch (error: any) {
    console.error('Error fetching game round details:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game round details' },
      { status: 500 }
    )
  }
}

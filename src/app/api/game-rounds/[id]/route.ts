// src/app/api/game-rounds/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy thông tin chi tiết game round
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
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Lấy thông tin các bets trong game này
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
      console.error('Error fetching bets:', betsError)
    }

    // Lấy thông tin các bets của user hiện tại trong game này
    const { data: userBets, error: userBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (userBetsError) {
      console.error('Error fetching user bets:', userBetsError)
    }

    // Lấy thông tin profile của user để biết số dư
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
    }

    return NextResponse.json({
      gameRound,
      bets: bets || [],
      userBets: userBets || [],
      userBalance: profile?.balance || 0,
    })
  } catch (error: any) {
    console.error('Error fetching game round details:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game round details' },
      { status: 500 }
    )
  }
}

// src/app/api/game-rounds/[id]/my-bets/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
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

    // Lấy danh sách cược của người dùng trong game này
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('game_round_id', gameId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user bets:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch user bets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      count: data.length,
      gameId,
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Error in get user bets API:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching user bets' },
      { status: 500 }
    )
  }
}

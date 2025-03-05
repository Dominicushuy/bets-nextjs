// src/app/api/game-rounds/[id]/complete/route.ts
import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const { winningNumber } = await req.json()

    if (!winningNumber) {
      return NextResponse.json(
        { error: 'Winning number is required' },
        { status: 400 }
      )
    }

    const supabase: SupabaseClient = createClient()

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
        { error: 'Only admin can complete game rounds' },
        { status: 403 }
      )
    }

    // Gọi function để hoàn thành lượt chơi
    const { data, error } = await supabase.rpc('complete_game_round', {
      p_game_id: gameId,
      p_winning_number: winningNumber,
      p_admin_id: user.id,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error completing game round' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error completing game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error completing game round' },
      { status: 500 }
    )
  }
}

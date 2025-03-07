// src/app/api/game-rounds/[id]/number-distribution/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id

  try {
    const supabase = createClient()

    // Lấy phân phối số cho trò chơi này
    const { data, error } = await supabase.rpc('get_number_distribution', {
      p_game_id: gameId,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error fetching number distribution' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || {})
  } catch (error: any) {
    console.error('Error fetching number distribution:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching number distribution' },
      { status: 500 }
    )
  }
}

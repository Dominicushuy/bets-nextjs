// src/app/api/game-rounds/[id]/bet-stats/route.ts
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

    // Lấy thông tin thống kê game
    const { data: gameStats, error: statsError } = await supabase.rpc(
      'get_game_stats',
      {
        p_game_id: gameId,
      }
    )

    if (statsError) {
      console.error('Error fetching game stats:', statsError)
      return NextResponse.json(
        { error: statsError.message || 'Failed to fetch game stats' },
        { status: 500 }
      )
    }

    // Lấy phân phối số lượng đặt cược
    const { data: numberDistribution, error: distributionError } =
      await supabase.rpc('get_number_distribution', {
        p_game_id: gameId,
      })

    if (distributionError) {
      console.error('Error fetching number distribution:', distributionError)
      return NextResponse.json(
        {
          error:
            distributionError.message || 'Failed to fetch number distribution',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      gameStats,
      numberDistribution,
      gameId,
    })
  } catch (error: any) {
    console.error('Error in get bet stats API:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching bet stats' },
      { status: 500 }
    )
  }
}

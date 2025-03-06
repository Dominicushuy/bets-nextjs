// src/app/api/game-rounds/[id]/number-distribution/route.ts

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
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy phân phối số lượng đặt cược
    const { data, error } = await supabase.rpc('get_number_distribution', {
      p_game_id: gameId,
    })

    if (error) {
      // Fallback: Tính toán thủ công nếu RPC không khả dụng
      const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select('selected_number, amount')
        .eq('game_round_id', gameId)

      if (betsError) {
        return NextResponse.json(
          { error: 'Failed to fetch bet data' },
          { status: 500 }
        )
      }

      // Tính toán phân phối số lượng
      const distribution = bets.reduce(
        (
          acc: { [key: number]: { count: number; totalAmount: number } },
          bet: { selected_number: number; amount: number }
        ) => {
          if (!acc[bet.selected_number]) {
            acc[bet.selected_number] = {
              count: 0,
              totalAmount: 0,
            }
          }
          acc[bet.selected_number].count++
          acc[bet.selected_number].totalAmount += bet.amount
          return acc
        },
        {}
      )

      return NextResponse.json({ distribution })
    }

    return NextResponse.json({ distribution: data })
  } catch (error: any) {
    console.error('Error fetching number distribution:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching number distribution' },
      { status: 500 }
    )
  }
}

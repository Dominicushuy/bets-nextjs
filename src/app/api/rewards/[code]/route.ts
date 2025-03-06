// src/app/api/rewards/[code]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra reward
    const { data: reward, error: rewardError } = await supabase
      .from('reward_codes')
      .select(
        `
        *,
        game:game_round_id (
          id,
          status,
          winning_number,
          start_time,
          end_time
        )
      `
      )
      .eq('code', code)
      .single()

    if (rewardError) {
      return NextResponse.json(
        { error: 'Reward code not found' },
        { status: 404 }
      )
    }

    // Kiểm tra xem reward có thuộc về user hiện tại không
    if (reward.user_id !== user.id) {
      return NextResponse.json(
        { error: 'This reward does not belong to you' },
        { status: 403 }
      )
    }

    // Kiểm tra trạng thái
    const currentDate = new Date()
    const expiryDate = new Date(reward.expiry_date)
    const isExpired = expiryDate < currentDate

    return NextResponse.json({
      reward,
      status: {
        isUsed: reward.is_used,
        isExpired,
        isAvailable: !reward.is_used && !isExpired,
        expiryDate: reward.expiry_date,
        timeLeft: isExpired ? 0 : expiryDate.getTime() - currentDate.getTime(),
      },
    })
  } catch (error: any) {
    console.error('Error fetching reward:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching reward' },
      { status: 500 }
    )
  }
}

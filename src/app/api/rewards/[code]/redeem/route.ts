// src/app/api/rewards/[code]/redeem/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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

    // Kiểm tra reward trước khi đổi
    const { data: reward, error: rewardError } = await supabase
      .from('reward_codes')
      .select('*')
      .eq('code', code)
      .eq('user_id', user.id)
      .single()

    if (rewardError) {
      return NextResponse.json(
        { error: 'Reward code not found or does not belong to you' },
        { status: 404 }
      )
    }

    if (reward.is_used) {
      return NextResponse.json(
        { error: 'This reward has already been redeemed' },
        { status: 400 }
      )
    }

    if (new Date(reward.expiry_date) < new Date()) {
      return NextResponse.json(
        { error: 'This reward has expired' },
        { status: 400 }
      )
    }

    // Gọi function để đổi phần thưởng
    const { error } = await supabase.rpc('redeem_reward', {
      p_code: code,
      p_user_id: user.id,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error redeeming reward' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: {
        success: true,
        message: 'Phần thưởng đã được đổi thành công!',
        amount: reward.amount,
      },
    })
  } catch (error: any) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: error.message || 'Error redeeming reward' },
      { status: 500 }
    )
  }
}

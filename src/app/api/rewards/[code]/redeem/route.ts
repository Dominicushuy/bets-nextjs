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

    // Gọi function để đổi phần thưởng
    const { data, error } = await supabase.rpc('redeem_reward', {
      p_code: code,
      p_user_id: user.id,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error redeeming reward' },
        { status: 400 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: error.message || 'Error redeeming reward' },
      { status: 500 }
    )
  }
}

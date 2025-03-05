// src/app/api/profile/level-progress/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { calculateExperienceToNextLevel } from '@/services/profile-service'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // Lấy thông tin người dùng đang đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Tính toán tiến trình cấp độ
    const levelProgress = await calculateExperienceToNextLevel(user.id)

    return NextResponse.json({ data: levelProgress })
  } catch (error: any) {
    console.error('Error calculating level progress:', error)
    return NextResponse.json(
      { error: error.message || 'Error calculating level progress' },
      { status: 500 }
    )
  }
}

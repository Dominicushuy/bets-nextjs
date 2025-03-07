// src/app/api/statistics/level-benefits/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy cấp độ người dùng hiện tại
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('level')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Lấy thông tin phúc lợi cho cấp độ hiện tại
    const { data: currentLevelData, error: currentLevelError } = await supabase
      .from('user_levels')
      .select('*')
      .eq('level', profile.level)
      .single()

    if (currentLevelError) {
      return NextResponse.json(
        { error: currentLevelError.message },
        { status: 500 }
      )
    }

    // Lấy thông tin phúc lợi cho cấp độ tiếp theo (nếu có)
    const { data: nextLevelData, error: nextLevelError } = await supabase
      .from('user_levels')
      .select('*')
      .eq('level', profile.level + 1)
      .single()

    // Nếu không có level tiếp theo (đã đạt cấp độ cao nhất)
    const isMaxLevel = nextLevelError && nextLevelError.code === 'PGRST116'

    // Chuẩn bị dữ liệu phúc lợi
    const allLevels = await supabase
      .from('user_levels')
      .select('*')
      .order('level')

    return NextResponse.json({
      currentLevel: {
        level: currentLevelData.level,
        name: currentLevelData.name,
        benefits: currentLevelData.benefits,
        icon: currentLevelData.icon,
        experienceRequired: currentLevelData.experience_required,
      },
      nextLevel: isMaxLevel
        ? null
        : {
            level: nextLevelData.level,
            name: nextLevelData.name,
            benefits: nextLevelData.benefits,
            icon: nextLevelData.icon,
            experienceRequired: nextLevelData.experience_required,
          },
      isMaxLevel,
      allLevels: allLevels.data?.map((level) => ({
        level: level.level,
        name: level.name,
        icon: level.icon,
        experienceRequired: level.experience_required,
        benefits: level.benefits,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching level benefits:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching level benefits' },
      { status: 500 }
    )
  }
}

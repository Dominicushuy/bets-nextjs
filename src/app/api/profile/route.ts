import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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
    // Lấy thông tin profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    // Lấy thống kê người dùng
    const { data: statistics, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      // Bỏ qua lỗi không tìm thấy
      throw statsError
    }

    return NextResponse.json({
      profile,
      statistics: statistics || null,
    })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    const body = await request.json()
    const { updates } = body

    if (!updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Không cho phép cập nhật role thông qua API này
    delete updates.role

    // Cập nhật profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()

    if (error) throw error

    return NextResponse.json({ data: data[0] })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: error.message || 'Error updating profile' },
      { status: 500 }
    )
  }
}

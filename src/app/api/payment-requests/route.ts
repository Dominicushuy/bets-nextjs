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
    // Kiểm tra xem người dùng có phải admin không
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    let query = supabase
      .from('payment_requests')
      .select(
        `
        *,
        profiles:user_id (phone),
        processed_by_profile:processed_by (phone)
      `
      )
      .order('request_date', { ascending: false })

    // Nếu không phải admin, chỉ lấy payment requests của user đó
    if (profile.role !== 'admin') {
      query = query.eq('user_id', user.id)
    }

    // Lọc theo status nếu có
    const status = request.nextUrl.searchParams.get('status')
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching payment requests:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching payment requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const { amount, proofImage } = body

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        user_id: user.id,
        amount,
        proof_image: proofImage,
        status: 'pending',
        request_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error creating payment request:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating payment request' },
      { status: 500 }
    )
  }
}

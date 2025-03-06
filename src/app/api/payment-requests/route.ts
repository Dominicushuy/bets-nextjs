import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const paymentRequestSchema = z.object({
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  proof_image: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Kiểm tra đăng nhập
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Lấy các query params
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const page = parseInt(url.searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Kiểm tra vai trò người dùng
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // Khởi tạo query
    let query = supabase
      .from('payment_requests')
      .select(
        '*, profiles!payment_requests_user_id_fkey(display_name, email)',
        { count: 'exact' }
      )
      .order('request_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Nếu không phải admin, chỉ xem yêu cầu của mình
    if (userProfile?.role !== 'admin') {
      query = query.eq('user_id', userId)
    }

    // Thêm filter nếu có
    if (status) {
      query = query.eq('status', status)
    }

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching payment requests:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Unexpected error in payment requests GET:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Kiểm tra đăng nhập
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Lấy dữ liệu từ request body
    const requestData = await req.json()

    // Validate dữ liệu
    const validationResult = paymentRequestSchema.safeParse(requestData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      )
    }

    // Tạo yêu cầu thanh toán mới
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        user_id: userId,
        amount: requestData.amount,
        status: 'pending',
        proof_image: requestData.proof_image,
        notes: requestData.notes,
        request_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating payment request:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Tạo thông báo cho user về việc yêu cầu đã được tạo
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Yêu cầu thanh toán đã được tạo',
      message: `Yêu cầu thanh toán ${requestData.amount} VND của bạn đã được tạo và đang chờ xét duyệt.`,
      type: 'payment',
      related_resource_id: data.id,
      related_resource_type: 'payment_request',
      is_read: false,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error in payment requests POST:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Lấy thông tin người dùng đang đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Kiểm tra xem người dùng có phải admin không
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admin can process payment requests' },
      { status: 403 }
    )
  }

  try {
    const requestId = params.id
    const body = await request.json()
    const { status, notes } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get the payment request
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      )
    }

    // Update the payment request
    const { data, error: updateError } = await supabase
      .from('payment_requests')
      .update({
        status,
        processed_by: user.id,
        processed_date: new Date().toISOString(),
        notes,
      })
      .eq('id', requestId)
      .select()
      .single()

    if (updateError) throw updateError

    // If approved, update user balance
    if (status === 'approved' && paymentRequest) {
      const { error: rpcError } = await supabase.rpc('update_user_balance', {
        user_id: paymentRequest.user_id,
        amount: paymentRequest.amount,
        is_increase: true,
      })

      if (rpcError) throw rpcError
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error processing payment request:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing payment request' },
      { status: 500 }
    )
  }
}

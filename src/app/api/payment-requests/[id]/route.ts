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

    // Gửi thông báo cho người dùng
    await supabase.from('notifications').insert({
      user_id: paymentRequest.user_id,
      title:
        status === 'approved'
          ? 'Yêu cầu nạp tiền được duyệt'
          : 'Yêu cầu nạp tiền bị từ chối',
      message:
        status === 'approved'
          ? `Yêu cầu nạp ${paymentRequest.amount.toLocaleString()} VND của bạn đã được duyệt.`
          : `Yêu cầu nạp ${paymentRequest.amount.toLocaleString()} VND của bạn đã bị từ chối. Lý do: ${
              notes || 'Không đạt yêu cầu'
            }`,
      type: 'payment',
      related_resource_id: requestId,
      related_resource_type: 'payment_request',
      is_read: false,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error processing payment request:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing payment request' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

  try {
    const requestId = params.id

    // Lấy thông tin payment request
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

    // Kiểm tra quyền: Chỉ admin hoặc chính người dùng đó mới được xóa
    // Nếu là người dùng thông thường, chỉ được xóa payment request của chính mình và ở trạng thái pending
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = paymentRequest.user_id === user.id
    const isPending = paymentRequest.status === 'pending'

    if (!isAdmin && (!isOwner || !isPending)) {
      return NextResponse.json(
        {
          error: 'You can only delete your own pending payment requests',
        },
        { status: 403 }
      )
    }

    // Xóa payment request
    const { error: deleteError } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', requestId)

    if (deleteError) throw deleteError

    // Xóa file ảnh bằng chứng nếu có
    if (paymentRequest.proof_image) {
      // Extract the path from the URL
      const urlPath = new URL(paymentRequest.proof_image).pathname
      const filepath = urlPath.split('/').slice(-2).join('/') // Get last 2 parts (userId/filename)

      if (filepath) {
        await supabase.storage.from('payment_proofs').remove([filepath])
      }
    }

    // Ghi log hệ thống
    await supabase.from('system_logs').insert({
      action_type: 'payment_request_deleted',
      description: `Payment request ${requestId} deleted by ${
        isAdmin ? 'admin' : 'user'
      }`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting payment request:', error)
    return NextResponse.json(
      { error: error.message || 'Error deleting payment request' },
      { status: 500 }
    )
  }
}

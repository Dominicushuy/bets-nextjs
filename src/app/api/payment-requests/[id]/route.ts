import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const updatePaymentRequestSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  proof_image: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const requestId = params.id

    // Lấy thông tin user để kiểm tra quyền
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // Khởi tạo query để lấy payment request chi tiết
    let query = supabase
      .from('payment_requests')
      .select('*, profiles!payment_requests_user_id_fkey(display_name, email)')
      .eq('id', requestId)

    // Nếu không phải admin, chỉ cho xem yêu cầu của chính mình
    if (userProfile?.role !== 'admin') {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.single()

    if (error) {
      // Nếu không tìm thấy hoặc không có quyền
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            error:
              'Payment request not found or you do not have permission to view it',
          },
          { status: 404 }
        )
      }

      console.error('Error fetching payment request:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error in payment request GET:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const requestId = params.id

    // Lấy thông tin user để kiểm tra quyền
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // Lấy dữ liệu từ request body
    const updateData = await req.json()

    // Validate dữ liệu
    const validationResult = updatePaymentRequestSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      )
    }

    // Lấy thông tin payment request hiện tại
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('user_id, amount, status')
      .eq('id', requestId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      )
    }

    // Nếu không phải admin, chỉ cho phép cập nhật một số trường nhất định
    if (userProfile?.role !== 'admin') {
      // Người dùng thông thường chỉ được cập nhật yêu cầu của chính mình và chỉ khi status là pending
      if (paymentRequest.user_id !== userId) {
        return NextResponse.json(
          {
            error: 'You do not have permission to update this payment request',
          },
          { status: 403 }
        )
      }

      if (paymentRequest.status !== 'pending') {
        return NextResponse.json(
          {
            error:
              'Cannot update payment request that is not in pending status',
          },
          { status: 400 }
        )
      }

      // Chỉ cho phép cập nhật proof_image và notes
      const { data, error } = await supabase
        .from('payment_requests')
        .update({
          proof_image: updateData.proof_image,
          notes: updateData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Error updating payment request:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    } else {
      // Admin xử lý yêu cầu thanh toán
      // Nếu admin đang duyệt/từ chối yêu cầu
      if (updateData.status && updateData.status !== paymentRequest.status) {
        const newStatus = updateData.status
        const processedDate = new Date().toISOString()

        // Cập nhật yêu cầu thanh toán
        const { data, error } = await supabase
          .from('payment_requests')
          .update({
            status: newStatus,
            processed_date: processedDate,
            processed_by: userId,
            notes: updateData.notes || null,
            updated_at: processedDate,
          })
          .eq('id', requestId)
          .select()
          .single()

        if (error) {
          console.error('Error updating payment request status:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Nếu duyệt, cập nhật số dư người dùng
        if (newStatus === 'approved') {
          // Gọi function update_user_balance
          const { data: balanceData, error: balanceError } = await supabase.rpc(
            'update_user_balance',
            {
              user_id: paymentRequest.user_id,
              amount: paymentRequest.amount,
              is_increase: true,
            }
          )

          if (balanceError) {
            console.error('Error updating user balance:', balanceError)
            // Revert trạng thái payment request nếu cập nhật số dư thất bại
            await supabase
              .from('payment_requests')
              .update({
                status: 'pending',
                processed_date: null,
                processed_by: null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', requestId)

            return NextResponse.json(
              { error: balanceError.message },
              { status: 500 }
            )
          }
        }

        // Tạo thông báo cho người dùng
        await supabase.from('notifications').insert({
          user_id: paymentRequest.user_id,
          title:
            newStatus === 'approved'
              ? 'Yêu cầu thanh toán được duyệt'
              : 'Yêu cầu thanh toán bị từ chối',
          message:
            newStatus === 'approved'
              ? `Yêu cầu nạp ${paymentRequest.amount} VND của bạn đã được duyệt.`
              : `Yêu cầu nạp ${
                  paymentRequest.amount
                } VND của bạn đã bị từ chối. Lý do: ${
                  updateData.notes || 'Không rõ'
                }.`,
          type: 'payment',
          related_resource_id: requestId,
          related_resource_type: 'payment_request',
          is_read: false,
          created_at: new Date().toISOString(),
        })

        // Ghi log hệ thống
        await supabase.from('system_logs').insert({
          action_type:
            newStatus === 'approved' ? 'payment_approved' : 'payment_rejected',
          description: `Payment request ${requestId} ${newStatus} by admin ${userId}`,
          user_id: userId,
          timestamp: new Date().toISOString(),
        })

        return NextResponse.json({ data })
      } else {
        // Cập nhật thông thường các trường khác
        const { data, error } = await supabase
          .from('payment_requests')
          .update({
            notes: updateData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', requestId)
          .select()
          .single()

        if (error) {
          console.error('Error updating payment request:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
      }
    }
  } catch (error) {
    console.error('Unexpected error in payment request PUT:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const requestId = params.id

    // Lấy thông tin user để kiểm tra quyền
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // Lấy thông tin payment request hiện tại
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('user_id, status')
      .eq('id', requestId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      )
    }

    // Kiểm tra quyền - chỉ admin hoặc chủ request (khi status là pending) mới được xóa
    if (
      userProfile?.role !== 'admin' &&
      (paymentRequest.user_id !== userId || paymentRequest.status !== 'pending')
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this payment request' },
        { status: 403 }
      )
    }

    // Xóa payment request
    const { error } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', requestId)

    if (error) {
      console.error('Error deleting payment request:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ghi log hệ thống nếu là admin
    if (userProfile?.role === 'admin') {
      await supabase.from('system_logs').insert({
        action_type: 'payment_request_deleted',
        description: `Payment request ${requestId} deleted by admin ${userId}`,
        user_id: userId,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in payment request DELETE:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

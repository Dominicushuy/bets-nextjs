import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { uploadPaymentProof } from '@/lib/supabase/storage'

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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'payment_proof' // Mặc định là payment_proof

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload file dựa vào loại
    let result
    if (type === 'avatar') {
      // Sẽ implement trong hook uploadProfileAvatar
      return NextResponse.json(
        { error: 'Use profile API for avatar uploads' },
        { status: 400 }
      )
    } else {
      // Mặc định là payment_proof
      result = await uploadPaymentProof(user.id, file)
    }

    return NextResponse.json({ url: result.url, path: result.path })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
}

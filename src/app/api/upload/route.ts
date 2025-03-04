import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

    // Tạo tên file độc nhất
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `payment_proofs/${fileName}`

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload file lên Supabase Storage
    const { data, error } = await supabase.storage
      .from('payment_proofs')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Lấy URL công khai
    const { data: urlData } = supabase.storage
      .from('payment_proofs')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
}

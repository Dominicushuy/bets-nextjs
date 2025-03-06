// src/app/api/upload/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp' // Import sharp for image processing

// Cấu hình upload
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
]
const ALLOWED_BUCKETS = {
  payment_proof: 'payment_proofs',
  avatar: 'user_avatars',
  game_image: 'game_images',
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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'payment_proof' // Mặc định là payment_proof
    const resize = formData.get('resize') === 'true' // Có nén ảnh hay không

    // Validate input
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Kiểm tra loại bucket đã cho phép chưa
    if (!Object.keys(ALLOWED_BUCKETS).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type' },
        { status: 400 }
      )
    }

    // Kiểm tra loại file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Only image files are allowed',
          allowedTypes: ALLOWED_IMAGE_TYPES,
        },
        { status: 400 }
      )
    }

    // Kiểm tra kích thước file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size must be less than ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 }
      )
    }

    // Lấy extension từ MIME type thay vì từ tên file (an toàn hơn)
    let fileExt
    switch (file.type) {
      case 'image/jpeg':
      case 'image/jpg':
        fileExt = 'jpg'
        break
      case 'image/png':
        fileExt = 'png'
        break
      case 'image/webp':
        fileExt = 'webp'
        break
      default:
        fileExt = 'jpg'
    }

    // Tạo tên file độc nhất với hậu tố ngẫu nhiên
    const fileName = `${user.id}/${Date.now()}_${uuidv4().substring(
      0,
      8
    )}.${fileExt}`
    const bucket = ALLOWED_BUCKETS[type as keyof typeof ALLOWED_BUCKETS]

    // Đọc buffer từ file
    const arrayBuffer = await file.arrayBuffer()
    let buffer = new Uint8Array(arrayBuffer)

    // Xử lý ảnh nếu yêu cầu resize
    if (resize && file.type.startsWith('image/')) {
      try {
        // Xử lý ảnh với sharp để giảm kích thước và tối ưu hóa
        const processedImage = await sharp(buffer)
          .resize({
            width: 1200, // Max width
            height: 1200, // Max height
            fit: 'inside', // Giữ tỷ lệ khung hình
            withoutEnlargement: true, // Không phóng to ảnh nhỏ
          })
          .toFormat(fileExt as 'jpeg' | 'png' | 'webp', {
            quality: 80, // Chất lượng 80%
            progressive: true, // Tải dần
          })
          .toBuffer()

        buffer = new Uint8Array(processedImage)
      } catch (err) {
        console.warn('Image processing failed, using original image:', err)
        // Continue with original image if processing fails
      }
    }

    // Upload lên Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Error uploading file' },
        { status: 500 }
      )
    }

    // Lấy URL công khai
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    // Nếu đây là avatar, cập nhật thông tin profile
    if (type === 'avatar') {
      // Xóa avatar cũ nếu có
      const { data: oldProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      if (oldProfile?.avatar_url) {
        try {
          // Extract path từ URL cũ
          const oldUrl = new URL(oldProfile.avatar_url)
          const oldPath = oldUrl.pathname.split('/').slice(-2).join('/')

          if (oldPath && oldPath.startsWith(user.id)) {
            await supabase.storage.from('user_avatars').remove([oldPath])
          }
        } catch (err) {
          console.warn('Failed to delete old avatar:', err)
        }
      }

      // Cập nhật URL avatar mới
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Error updating profile with avatar:', profileError)
      }
    }

    // Ghi log
    await supabase.from('system_logs').insert({
      action_type: 'file_upload',
      description: `User uploaded ${file.type} (${Math.round(
        buffer.length / 1024
      )} KB) as ${type}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      url: urlData.publicUrl,
      path: fileName,
      success: true,
      bucket,
      size: buffer.length,
      type: file.type,
      originalSize: file.size,
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
}

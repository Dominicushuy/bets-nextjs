import { supabase } from './client'
import { v4 as uuidv4 } from 'uuid'

/**
 * Upload avatar người dùng
 */
export async function uploadAvatar(userId: string, file: File) {
  // Tạo tên file độc nhất
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}_${uuidv4()}.${fileExt}`
  const filePath = fileName

  // Upload lên Storage
  const { error } = await supabase.storage
    .from('user_avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Lấy URL công khai
  const { data } = supabase.storage.from('user_avatars').getPublicUrl(filePath)

  return {
    path: filePath,
    url: data.publicUrl,
  }
}

/**
 * Upload minh chứng thanh toán
 */
export async function uploadPaymentProof(userId: string, file: File) {
  // Tạo tên file độc nhất
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}_payment.${fileExt}`
  const filePath = fileName

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  // Upload lên Supabase Storage
  const { error } = await supabase.storage
    .from('payment_proofs')
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Lấy URL công khai
  const { data } = supabase.storage
    .from('payment_proofs')
    .getPublicUrl(filePath)

  return {
    path: filePath,
    url: data.publicUrl,
  }
}

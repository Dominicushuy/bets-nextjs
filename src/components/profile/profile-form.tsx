// src/components/profile/profile-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  useUpdateUserProfile,
  useUploadProfileAvatar,
} from '@/hooks/profile-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Camera } from 'lucide-react'
import { ExtendedProfile } from '@/types/database'

interface ProfileFormProps {
  initialData: ExtendedProfile
  userId: string
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  )

  // Mutations
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile()
  const { mutate: uploadAvatar, isPending: isUploading } =
    useUploadProfileAvatar()

  // Đang xử lý
  const isProcessing = isUpdating || isUploading

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý upload avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Nếu có thay đổi avatar, upload trước
      if (avatarFile) {
        uploadAvatar(
          { userId, file: avatarFile },
          {
            onSuccess: () => {
              setAvatarFile(null)
            },
            onError: (error: any) => {
              toast.error(`Lỗi khi tải lên avatar: ${error.message}`)
            },
          }
        )
      }

      // Cập nhật thông tin profile
      updateProfile(
        {
          userId,
          updates: {
            display_name: formData.display_name,
            // email và phone có thể cần xử lý đặc biệt vì liên quan đến auth
          },
        },
        {
          onSuccess: () => {
            router.refresh()
          },
        }
      )
    } catch (error: any) {
      toast.error(`Lỗi khi cập nhật hồ sơ: ${error.message}`)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className='p-6 space-y-6'>
        <div className='flex flex-col items-center'>
          <div className='relative group'>
            <Avatar
              src={avatarPreview}
              alt={formData.display_name || 'Avatar'}
              size='xl'
              className='h-24 w-24'
            />
            <label
              htmlFor='avatar-upload'
              className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity'>
              <Camera className='h-8 w-8 text-white' />
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarChange}
                disabled={isProcessing}
              />
            </label>
          </div>
          <p className='mt-2 text-sm text-gray-500'>
            Nhấp vào ảnh để thay đổi avatar
          </p>
        </div>

        <div className='space-y-4'>
          <Input
            label='Tên hiển thị'
            name='display_name'
            value={formData.display_name}
            onChange={handleChange}
            placeholder='Nhập tên hiển thị'
            disabled={isProcessing}
          />

          <Input
            label='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Nhập email'
            disabled={true} // Email liên quan đến auth nên không cho sửa trực tiếp
            error={
              formData.email ? '' : 'Email là bắt buộc cho tài khoản của bạn'
            }
          />

          <Input
            label='Số điện thoại'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Nhập số điện thoại'
            disabled={true} // Phone cũng là thông tin xác thực nên không cho sửa trực tiếp
          />
        </div>

        <div className='space-y-2'>
          <p className='text-sm text-gray-500'>
            <span className='font-medium'>Lưu ý:</span> Để thay đổi email hoặc
            số điện thoại, vui lòng liên hệ với quản trị viên.
          </p>
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            variant='primary'
            loading={isProcessing}
            disabled={isProcessing}>
            Cập nhật hồ sơ
          </Button>
        </div>
      </form>
    </Card>
  )
}

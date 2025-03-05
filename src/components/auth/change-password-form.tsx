// src/components/auth/change-password-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useChangePassword } from '@/hooks/auth-hooks'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: changePassword, isPending } = useChangePassword()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    changePassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
          toast.success('Mật khẩu đã được thay đổi thành công')
          router.push('/profile')
        },
        onError: (error: any) => {
          if (error.message.includes('current password')) {
            setErrors((prev) => ({
              ...prev,
              currentPassword: 'Mật khẩu hiện tại không chính xác',
            }))
          } else {
            toast.error(
              error.message || 'Không thể thay đổi mật khẩu. Vui lòng thử lại.'
            )
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Mật khẩu hiện tại'
        name='currentPassword'
        type={showCurrentPassword ? 'text' : 'password'}
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder='Nhập mật khẩu hiện tại'
        icon={<Lock className='h-5 w-5 text-gray-400' />}
        rightIcon={
          <button
            type='button'
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className='focus:outline-none'>
            {showCurrentPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400' />
            )}
          </button>
        }
        error={errors.currentPassword}
        disabled={isPending}
        required
      />

      <Input
        label='Mật khẩu mới'
        name='newPassword'
        type={showNewPassword ? 'text' : 'password'}
        value={formData.newPassword}
        onChange={handleChange}
        placeholder='Nhập mật khẩu mới'
        icon={<Lock className='h-5 w-5 text-gray-400' />}
        rightIcon={
          <button
            type='button'
            onClick={() => setShowNewPassword(!showNewPassword)}
            className='focus:outline-none'>
            {showNewPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400' />
            )}
          </button>
        }
        error={errors.newPassword}
        disabled={isPending}
        required
      />

      <Input
        label='Xác nhận mật khẩu mới'
        name='confirmPassword'
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder='Nhập lại mật khẩu mới'
        icon={<Lock className='h-5 w-5 text-gray-400' />}
        rightIcon={
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='focus:outline-none'>
            {showConfirmPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400' />
            )}
          </button>
        }
        error={errors.confirmPassword}
        disabled={isPending}
        required
      />

      <div className='pt-4'>
        <Button
          type='submit'
          variant='primary'
          fullWidth
          loading={isPending}
          disabled={isPending}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  )
}

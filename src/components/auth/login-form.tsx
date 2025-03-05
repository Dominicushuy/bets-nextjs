// src/components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useLogin } from '@/hooks/auth-hooks'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: login, isPending } = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

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

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    login(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push('/dashboard')
        },
        onError: (error: any) => {
          // Xử lý các lỗi cụ thể
          if (error.message.includes('email')) {
            setErrors((prev) => ({
              ...prev,
              email: 'Email không tồn tại',
            }))
          } else if (error.message.includes('password')) {
            setErrors((prev) => ({
              ...prev,
              password: 'Mật khẩu không chính xác',
            }))
          } else {
            toast.error(
              error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
            )
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='Nhập email của bạn'
        icon={<Mail className='h-5 w-5 text-gray-400' />}
        error={errors.email}
        disabled={isPending}
        required
      />

      <Input
        label='Mật khẩu'
        name='password'
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        placeholder='Nhập mật khẩu của bạn'
        icon={<Lock className='h-5 w-5 text-gray-400' />}
        rightIcon={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='focus:outline-none'>
            {showPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400' />
            )}
          </button>
        }
        error={errors.password}
        disabled={isPending}
        required
      />

      <div className='flex items-center justify-between'>
        <Checkbox
          label='Ghi nhớ đăng nhập'
          name='remember'
          checked={formData.remember}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>

      <div className='pt-4'>
        <Button
          type='submit'
          variant='primary'
          fullWidth
          loading={isPending}
          disabled={isPending}>
          Đăng nhập
        </Button>
      </div>
    </form>
  )
}

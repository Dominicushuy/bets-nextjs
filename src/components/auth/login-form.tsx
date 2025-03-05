'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, AtSignIcon, LockIcon } from 'lucide-react'
import { useLogin } from '@/hooks/auth-hooks'

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({
  redirectTo = '/dashboard',
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const { mutate: login, isPending: isLoading } = useLogin()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push(redirectTo)
        },
        onError: (error: any) => {
          if (error.message.includes('Invalid login')) {
            setErrors({ form: 'Email hoặc mật khẩu không chính xác' })
          } else {
            setErrors({
              form: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
            })
          }
        },
      }
    )
  }

  return (
    <form className='space-y-5' onSubmit={handleSubmit}>
      {errors.form && (
        <div className='p-3 bg-red-100 text-red-700 rounded-md text-sm'>
          {errors.form}
        </div>
      )}

      {/* Email Field */}
      <div className='relative'>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Email
        </label>
        <div className='relative mt-1 rounded-md'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <AtSignIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='email'
            name='email'
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) {
                const newErrors = { ...errors }
                delete newErrors.email
                setErrors(newErrors)
              }
            }}
            className={`block w-full rounded-md border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:border-gray-400`}
            placeholder='Nhập email của bạn'
          />
        </div>
        {errors.email && (
          <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className='flex items-center justify-between mb-1'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'>
            Mật khẩu
          </label>
          <div className='text-sm'>
            <Link
              href='/forgot-password'
              className='font-medium text-primary-600 hover:text-primary-500 transition-colors'>
              Quên mật khẩu?
            </Link>
          </div>
        </div>
        <div className='relative mt-1 rounded-md'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <LockIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) {
                const newErrors = { ...errors }
                delete newErrors.password
                setErrors(newErrors)
              }
            }}
            className={`block w-full rounded-md border ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:border-gray-400`}
            placeholder='Nhập mật khẩu'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'>
            {showPassword ? (
              <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className='flex items-center'>
        <input
          id='remember-me'
          name='remember-me'
          type='checkbox'
          className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition'
        />
        <label
          htmlFor='remember-me'
          className='ml-2 block text-sm text-gray-700'>
          Ghi nhớ đăng nhập
        </label>
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type='submit'
          className='w-full py-3'
          disabled={isLoading}
          loading={isLoading}>
          Đăng nhập
        </Button>
      </div>
    </form>
  )
}

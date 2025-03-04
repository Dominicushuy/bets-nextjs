'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  EyeIcon,
  EyeOffIcon,
  AtSignIcon,
  PhoneIcon,
  LockIcon,
} from 'lucide-react'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>(
    'email'
  )
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard'
  const { signIn } = useAuth()

  // Determine identifier type
  useEffect(() => {
    if (identifier.includes('@')) {
      setIdentifierType('email')
    } else if (identifier.match(/[0-9]/)) {
      setIdentifierType('phone')
    }
  }, [identifier])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier || !password) {
      toast.error('Vui lòng nhập thông tin đăng nhập và mật khẩu')
      return
    }

    try {
      setLoading(true)

      // Xác định xem identifier là số điện thoại hay email
      let email = identifier
      if (!identifier.includes('@')) {
        // Nếu là số điện thoại, tạo email theo định dạng
        const cleanPhone = identifier.replace(/[^0-9]/g, '')
        email = `user_${cleanPhone}@${process.env.NEXT_PUBLIC_MAIL_DOMAIN}`
      }

      const { error } = await signIn(email, password)

      if (error) throw error

      toast.success('Đăng nhập thành công')
      router.push(redirectedFrom)
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='text-center mb-6'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 mb-2'>
          Đăng nhập
        </h2>
        <p className='text-sm text-gray-600'>
          Nhập thông tin đăng nhập của bạn để tiếp tục
        </p>
      </div>

      <div className='mt-8'>
        <form className='space-y-5' onSubmit={handleSubmit}>
          <div className='relative'>
            <label
              htmlFor='identifier'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Email hoặc Số điện thoại
            </label>
            <div className='relative mt-1 rounded-md'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                {identifierType === 'email' ? (
                  <AtSignIcon className='h-5 w-5 text-gray-400' />
                ) : (
                  <PhoneIcon className='h-5 w-5 text-gray-400' />
                )}
              </div>
              <input
                id='identifier'
                name='identifier'
                type='text'
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className='block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                          text-gray-900 placeholder-gray-400 focus:border-primary-500
                          focus:ring-1 focus:ring-primary-500 transition-all duration-200
                          shadow-sm hover:border-gray-400'
                placeholder='Nhập email hoặc số điện thoại'
              />
            </div>
          </div>

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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='block w-full rounded-md border border-gray-300 py-3 pl-10 pr-10
                          text-gray-900 placeholder-gray-400 focus:border-primary-500
                          focus:ring-1 focus:ring-primary-500 transition-all duration-200
                          shadow-sm hover:border-gray-400'
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
          </div>

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

          <div>
            <Button
              type='submit'
              className='w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                      transition-all duration-200 text-sm flex items-center justify-center'
              disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-50 text-gray-500'>
                hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-2 gap-3'>
            <button
              type='button'
              className='flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'>
              <svg className='h-5 w-5 mr-2' fill='#4285F4' viewBox='0 0 24 24'>
                <path d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z' />
              </svg>
              Google
            </button>

            <button
              type='button'
              className='flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'>
              <svg className='h-5 w-5 mr-2' fill='#1877F2' viewBox='0 0 24 24'>
                <path d='M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.02 20.38 19.54 18.58C21.06 16.78 21.9 14.49 21.9 12.06C21.9 6.53 17.4 2.04 12 2.04Z' />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className='mt-8 text-center text-sm text-gray-600'>
          Chưa có tài khoản?{' '}
          <Link
            href='/register'
            className='font-medium text-primary-600 hover:text-primary-500 transition-colors'>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  )
}

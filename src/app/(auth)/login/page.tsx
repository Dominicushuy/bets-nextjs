// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard'
  const { signIn } = useAuth()

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
    <div>
      <div className='text-center'>
        <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
          Đăng nhập vào tài khoản
        </h2>
        <p className='mt-2 text-sm text-gray-600'>
          Hoặc{' '}
          <Link
            href='/register'
            className='font-medium text-primary-600 hover:text-primary-500'>
            đăng ký tài khoản mới
          </Link>
        </p>
      </div>

      <div className='mt-8'>
        <div className='mt-6'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='identifier'
                className='block text-sm font-medium text-gray-700'>
                Email hoặc Số điện thoại
              </label>
              <div className='mt-1'>
                <input
                  id='identifier'
                  name='identifier'
                  type='text'
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm'
                  placeholder='Nhập email hoặc số điện thoại'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'>
                Mật khẩu
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm'
                  placeholder='Nhập mật khẩu'
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'>
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-primary-600 hover:text-primary-500'>
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={loading}>
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

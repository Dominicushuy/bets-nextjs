// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'
import { Loading } from '@/components/ui/loading'

export const metadata = {
  title: 'Đăng nhập - Game Cá Cược',
  description: 'Đăng nhập vào hệ thống Game Cá Cược',
}

export default function LoginPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Đăng nhập</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Đăng nhập để tiếp tục trải nghiệm Game Cá Cược
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>

      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          Bạn chưa có tài khoản?{' '}
          <Link
            href='/register'
            className='font-medium text-primary-600 hover:text-primary-500'>
            Đăng ký ngay
          </Link>
        </p>
        <p className='mt-2 text-sm'>
          <Link
            href='/forgot-password'
            className='font-medium text-gray-600 hover:text-gray-900'>
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </div>
  )
}

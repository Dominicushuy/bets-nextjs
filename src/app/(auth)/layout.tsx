'use client'

import Link from 'next/link'
import { UserIcon } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Left Panel - Forms */}
      <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          {/* Logo/Brand - Shown only on small screens */}
          <div className='flex justify-center mb-8 lg:hidden'>
            <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center'>
              <UserIcon className='h-6 w-6 text-primary-600' />
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Right Panel - Branded Background */}
      <div className='relative hidden w-0 flex-1 lg:block'>
        <div className='absolute inset-0 h-full w-full bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden'>
          {/* Decorative Elements */}
          <div className='absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-primary-400/20'></div>
          <div className='absolute -top-16 -right-16 w-64 h-64 rounded-full border border-primary-400/30'></div>
          <div className='absolute top-1/4 right-1/4 w-32 h-32 rounded-full border border-primary-400/20'></div>

          {/* Content */}
          <div className='flex h-full items-center justify-center p-12'>
            <div className='relative z-20 max-w-2xl'>
              <div className='animate-fade-in-up'>
                <div className='flex items-center justify-center mb-8'>
                  <div className='w-16 h-16 rounded-full bg-white/10 flex items-center justify-center'>
                    <UserIcon className='h-8 w-8 text-white' />
                  </div>
                </div>

                <div className='text-center text-white'>
                  <h2 className='text-4xl font-bold mb-4'>Game Platform</h2>
                  <p className='mt-4 text-xl text-primary-100 mb-10'>
                    Chào mừng đến với nền tảng game của chúng tôi
                  </p>

                  <div className='flex justify-center space-x-3 mb-16'>
                    <span className='w-3 h-3 rounded-full bg-white/30'></span>
                    <span className='w-3 h-3 rounded-full bg-white'></span>
                    <span className='w-3 h-3 rounded-full bg-white/30'></span>
                  </div>
                </div>
              </div>

              <div className='mt-20 pt-10 flex justify-center'>
                <div className='bg-white/10 rounded-xl p-6 backdrop-blur-sm max-w-md'>
                  <p className='text-white text-sm leading-relaxed'>
                    Nền tảng game của bạn thực sự đã thay đổi cách tôi chơi
                    game. Giao diện trực quan, dễ sử dụng và cộng đồng tuyệt
                    vời!
                  </p>
                  <div className='mt-4 flex items-center'>
                    <div className='h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3'>
                      <span className='text-white text-xs'>NT</span>
                    </div>
                    <div>
                      <p className='text-white text-sm font-medium'>
                        Nguyễn Thanh
                      </p>
                      <p className='text-primary-200 text-xs'>Game thủ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

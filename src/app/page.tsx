// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className='bg-white'>
      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-primary-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'></div>
        </div>

        <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Game Platform
            </h1>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Chào mừng đến với nền tảng game cá cược của chúng tôi. Đăng nhập
              để tiếp tục.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                href='/login'
                className='rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'>
                Đăng nhập
              </Link>
              <Link
                href='/register'
                className='text-sm font-semibold leading-6 text-gray-900'>
                Đăng ký <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
          <div className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-primary-800 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'></div>
        </div>
      </div>
    </div>
  )
}

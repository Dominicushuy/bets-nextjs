// src/app/(auth)/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Kiểm tra nếu user đã đăng nhập thì redirect về dashboard
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Game Cá Cược
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {children}
        </div>
      </div>
    </div>
  )
}

// src/app/(dashboard)/statistics/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import UserStatisticsContent from '@/components/statistics/user-statistics-content'

export const metadata = {
  title: 'Thống kê người dùng - Game Cá Cược',
  description: 'Xem thống kê chi tiết và cấp độ người dùng',
}

export default async function StatisticsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Thống kê & Cấp độ</h1>

      <Suspense fallback={<Loading />}>
        <UserStatisticsContent userId={session.user.id} />
      </Suspense>
    </div>
  )
}

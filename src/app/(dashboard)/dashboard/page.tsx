import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { Loading } from '@/components/ui/loading'

export const metadata = {
  title: 'Dashboard - Game Cá Cược',
  description: 'Trang tổng quan người dùng Game Cá Cược',
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Bảng điều khiển</h1>

      <Suspense fallback={<Loading />}>
        <DashboardContent userId={session.user.id} />
      </Suspense>
    </div>
  )
}

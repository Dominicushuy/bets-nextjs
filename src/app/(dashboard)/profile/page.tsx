// src/app/(dashboard)/profile/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import ProfileForm from '@/components/profile/profile-form'
import StatisticsCard from '@/components/profile/statistics-card'

export const metadata = {
  title: 'Hồ sơ cá nhân - Game Cá Cược',
  description: 'Quản lý thông tin cá nhân và thống kê người dùng',
}

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Lấy thông tin profile để hiển thị
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Lấy thông tin statistics nếu có
  const { data: statistics } = await supabase
    .from('user_statistics')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Hồ sơ cá nhân</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <Suspense fallback={<Loading />}>
            <ProfileForm initialData={profile} userId={session.user.id} />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Loading />}>
            <StatisticsCard statistics={statistics} profile={profile} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

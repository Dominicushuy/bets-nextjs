// src/app/(dashboard)/profile/page.tsx - Cập nhật từ file hiện tại
// Cập nhật trang Profile để thêm components mới

import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import ProfileForm from '@/components/profile/profile-form'
import UserStatistics from '@/components/profile/user-statistics'
import UserLevelProgress from '@/components/profile/user-level-progress'
import BetHistoryList from '@/components/profile/bet-history-list'
import UserLevelDetails from '@/components/user/UserLevelDetails'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LineChart } from 'lucide-react'

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

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Hồ sơ cá nhân</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Suspense fallback={<Loading />}>
            <ProfileForm initialData={profile} userId={session.user.id} />
          </Suspense>

          <Suspense fallback={<Loading />}>
            <UserLevelProgress userId={session.user.id} />
          </Suspense>

          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Lịch sử đặt cược gần đây</h2>
            <Link href='/history'>
              <Button variant='outline' size='sm'>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Suspense fallback={<Loading />}>
            <BetHistoryList userId={session.user.id} limit={5} />
          </Suspense>
        </div>

        <div className='space-y-6'>
          <Suspense fallback={<Loading />}>
            <UserStatistics userId={session.user.id} />
          </Suspense>

          <Link href='/statistics' className='block'>
            <Button variant='primary' fullWidth>
              <LineChart className='mr-2 h-4 w-4' />
              Xem thống kê chi tiết
            </Button>
          </Link>
        </div>
      </div>

      <div className='border-t pt-6 mt-8'>
        <h2 className='text-lg font-semibold mb-4'>
          Chi tiết cấp độ và phúc lợi
        </h2>
        <Suspense fallback={<Loading />}>
          <UserLevelDetails userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  )
}

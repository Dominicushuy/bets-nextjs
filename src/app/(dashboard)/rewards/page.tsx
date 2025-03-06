// src/app/(dashboard)/rewards/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import RewardsContent from '@/components/rewards/rewards-content'

export const metadata = {
  title: 'Phần thưởng - Game Cá Cược',
  description: 'Quản lý phần thưởng và mã thưởng trong Game Cá Cược',
}

export default async function RewardsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Lấy danh sách reward tổng quan cho SSR
  const { data: rewards } = await supabase
    .from('reward_codes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Phần thưởng</h1>

      <Suspense fallback={<Loading />}>
        <RewardsContent
          userId={session.user.id}
          initialRewards={rewards || []}
        />
      </Suspense>
    </div>
  )
}

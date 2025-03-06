// src/app/(dashboard)/rewards/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import RewardsContent from '@/components/rewards/rewards-content'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { rewardKeys } from '@/hooks/reward-hooks'

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

  // Prefetch data for initial render
  const queryClient = new QueryClient()

  // Prefetch rewards
  await queryClient.prefetchQuery({
    queryKey: rewardKeys.user(session.user.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_codes')
        .select(
          `
          *,
          game:game_round_id (
            id,
            status,
            winning_number,
            start_time,
            end_time
          )
        `
        )
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  // Prefetch reward stats
  await queryClient.prefetchQuery({
    queryKey: [...rewardKeys.user(session.user.id), 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_codes')
        .select('amount, is_used, expiry_date')
        .eq('user_id', session.user.id)

      if (error) throw error

      const currentDate = new Date()
      const stats = {
        totalRewards: data.length,
        totalAmount: data.reduce((sum, reward) => sum + reward.amount, 0),
        redeemedCount: data.filter((r) => r.is_used).length,
        pendingCount: data.filter(
          (r) => !r.is_used && new Date(r.expiry_date) > currentDate
        ).length,
        expiredCount: data.filter(
          (r) => !r.is_used && new Date(r.expiry_date) < currentDate
        ).length,
      }

      return stats
    },
  })

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Phần thưởng</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <RewardsContent userId={session.user.id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

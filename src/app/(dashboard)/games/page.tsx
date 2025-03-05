// src/app/(dashboard)/games/page.tsx (phiên bản cải tiến)
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import GamesList from '@/components/game/game-list'
import { Loading } from '@/components/ui/loading'
import { dehydrate } from '@tanstack/react-query'
import { HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { GameRound } from '@/types/database'

export const metadata = {
  title: 'Games - Game Cá Cược',
  description: 'Danh sách các lượt chơi Game Cá Cược',
}

export default async function GamesPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Sử dụng SSR để lấy dữ liệu ban đầu
  const queryClient = new QueryClient()

  // Prefetch active games
  await queryClient.prefetchQuery({
    queryKey: ['games', 'list', { status: 'active', page: 1, limit: 10 }],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('game_rounds')
        .select('*, creator:created_by (phone)', { count: 'exact' })
        .eq('status', 'active')
        .order('start_time', { ascending: false })
        .range(0, 9)

      return {
        data: data as GameRound[],
        pagination: {
          page: 1,
          limit: 10,
          totalRecords: count || 0,
          totalPages: Math.ceil((count || 0) / 10),
        },
      }
    },
  })

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Danh sách lượt chơi</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <GamesList userId={session.user.id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

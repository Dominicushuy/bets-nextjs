// src/app/(admin)/admin/games/[id]/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminGameDetail from '@/components/admin/games/admin-game-detail'
import { Loading } from '@/components/ui/loading'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

interface AdminGameDetailPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Chi tiết lượt chơi - Admin Game Cá Cược',
  description: 'Quản lý chi tiết lượt chơi trong hệ thống',
}

export default async function AdminGameDetailPage({
  params,
}: AdminGameDetailPageProps) {
  const gameId = params.id
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Kiểm tra quyền admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Prefetch data for initial render
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['admin', 'games', 'detail', gameId],
    queryFn: async () => {
      const { data: gameRound, error: gameError } = await supabase
        .from('game_rounds')
        .select(
          `
          *,
          creator:created_by (phone)
        `
        )
        .eq('id', gameId)
        .single()

      if (gameError) throw gameError

      // Lấy thông tin các bets trong game này
      const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select(
          `
          *,
          user:user_id (
            phone,
            display_name
          )
        `
        )
        .eq('game_round_id', gameId)
        .order('created_at', { ascending: false })

      if (betsError) throw betsError

      return {
        gameRound,
        bets: bets || [],
      }
    },
  })

  return (
    <div className='space-y-6'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <AdminGameDetail gameId={gameId} userId={session.user.id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

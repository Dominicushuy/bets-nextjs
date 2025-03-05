// src/app/(dashboard)/games/[id]/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import GameDetail from '@/components/game/game-detail'
import { Loading } from '@/components/ui/loading'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

interface GamePageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Chi tiết lượt chơi - Game Cá Cược',
  description: 'Chi tiết lượt chơi và đặt cược trong Game Cá Cược',
}

export default async function GamePage({ params }: GamePageProps) {
  const gameId = params.id
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Prefetch data for initial render
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['games', 'detail', gameId, 'details', session.user.id],
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
            phone
          )
        `
        )
        .eq('game_round_id', gameId)
        .order('created_at', { ascending: false })

      if (betsError) throw betsError

      // Lấy thông tin các bets của user trong game này
      const { data: userBets, error: userBetsError } = await supabase
        .from('bets')
        .select('*')
        .eq('game_round_id', gameId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (userBetsError) throw userBetsError

      // Lấy thông tin profile của user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError

      return {
        gameRound,
        bets: bets || [],
        userBets: userBets || [],
        userBalance: profile?.balance || 0,
      }
    },
  })

  // Prefetch user profile
  await queryClient.prefetchQuery({
    queryKey: ['profiles', 'detail', session.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <GameDetail gameId={gameId} userId={session.user.id} />
      </Suspense>
    </HydrationBoundary>
  )
}

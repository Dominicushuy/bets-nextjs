import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import GameDetail from '@/components/game/game-detail'
import { Loading } from '@/components/ui/loading'

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

  return (
    <Suspense fallback={<Loading />}>
      <GameDetail gameId={gameId} userId={session.user.id} />
    </Suspense>
  )
}

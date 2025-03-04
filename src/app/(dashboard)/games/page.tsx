import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import GamesList from '@/components/game/game-list'
import { Loading } from '@/components/ui/loading'

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

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Danh sách lượt chơi</h1>

      <Suspense fallback={<Loading />}>
        <GamesList userId={session.user.id} />
      </Suspense>
    </div>
  )
}

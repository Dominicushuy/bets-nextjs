import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import HistoryContent from '@/components/history/history-content'
import { Loading } from '@/components/ui/loading'

export const metadata = {
  title: 'Lịch sử - Game Cá Cược',
  description: 'Lịch sử đặt cược và thanh toán trong Game Cá Cược',
}

export default async function HistoryPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Lịch sử</h1>

      <Suspense fallback={<Loading />}>
        <HistoryContent userId={session.user.id} />
      </Suspense>
    </div>
  )
}

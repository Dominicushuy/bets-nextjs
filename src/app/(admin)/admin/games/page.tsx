// src/app/(admin)/admin/games/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import AdminGamesContent from '@/components/admin/games/admin-games-content'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

export const metadata = {
  title: 'Quản lý lượt chơi - Admin Game Cá Cược',
  description: 'Quản lý tất cả lượt chơi trong hệ thống',
}

export default async function AdminGamesPage() {
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
    queryKey: ['admin', 'games', 'list', { page: 1, limit: 10 }],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('game_rounds')
        .select('*, creator:created_by (phone)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(0, 9)

      if (error) throw error

      return {
        data,
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
      <h1 className='text-2xl font-bold'>Quản lý lượt chơi</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <AdminGamesContent userId={session.user.id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

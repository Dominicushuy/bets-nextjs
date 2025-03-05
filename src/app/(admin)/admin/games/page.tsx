import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminGameList from '@/components/admin/games/admin-game-list'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'

export const metadata = {
  title: 'Quản lý lượt chơi - Admin',
  description: 'Quản lý các lượt chơi trong hệ thống',
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

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Quản lý lượt chơi</h1>
        <Link href='/admin/games/new'>
          <Button variant='primary'>Tạo lượt chơi mới</Button>
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <AdminGameList />
      </Suspense>
    </div>
  )
}

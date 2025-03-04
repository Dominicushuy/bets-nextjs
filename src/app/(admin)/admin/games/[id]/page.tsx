import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminGameDetail from '@/components/admin/games/admin-game-detail'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Chi tiết lượt chơi - Admin',
  description: 'Xem chi tiết và quản lý lượt chơi',
}

export default async function GameDetailPage({
  params,
}: {
  params: { id: string }
}) {
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

  // Lấy thông tin lượt chơi
  const { data: game, error } = await supabase
    .from('game_rounds')
    .select('*')
    .eq('id', gameId)
    .single()

  if (error || !game) {
    notFound()
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Chi tiết lượt chơi</h1>
      <AdminGameDetail gameId={gameId} adminId={session.user.id} />
    </div>
  )
}

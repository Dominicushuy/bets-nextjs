import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminGameForm from '@/components/admin/games/admin-game-form'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Chỉnh sửa lượt chơi - Admin',
  description: 'Chỉnh sửa thông tin lượt chơi',
}

export default async function EditGamePage({
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

  // Chỉ cho phép sửa khi lượt chơi còn ở trạng thái pending
  if (game.status !== 'pending') {
    redirect(`/admin/games/${gameId}`)
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Chỉnh sửa lượt chơi</h1>
      <AdminGameForm userId={session.user.id} gameId={gameId} />
    </div>
  )
}

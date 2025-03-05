import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminGameForm from '@/components/admin/games/admin-game-form'

export const metadata = {
  title: 'Tạo lượt chơi mới - Admin',
  description: 'Tạo lượt chơi mới trong hệ thống',
}

export default async function NewGamePage() {
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
      <h1 className='text-2xl font-bold'>Tạo lượt chơi mới</h1>
      <AdminGameForm userId={session.user.id} />
    </div>
  )
}

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboardContent from '@/components/admin/admin/admin-dashboard-content'

export const metadata = {
  title: 'Admin Dashboard - Game Cá Cược',
  description: 'Trang quản trị hệ thống Game Cá Cược',
}

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Lấy thông tin profile để kiểm tra vai trò
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Tổng quan hệ thống</h1>
      <AdminDashboardContent />
    </div>
  )
}

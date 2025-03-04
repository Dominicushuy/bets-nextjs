import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AdminSidebar from '@/components/admin/admin/admin-sidebar'
import { Loading } from '@/components/ui/loading'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Lấy thông tin người dùng từ server
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Nếu chưa đăng nhập, redirect về trang login
  if (!session) {
    redirect('/login')
  }

  // Lấy thông tin profile để kiểm tra vai trò
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Nếu không phải admin, redirect về trang dashboard
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content */}
        <main className='flex-1'>
          <div className='container mx-auto px-6 py-8'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

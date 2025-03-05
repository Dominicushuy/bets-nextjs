// src/app/(dashboard)/profile/change-password/page.tsx
import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ChangePasswordForm from '@/components/auth/change-password-form'
import { Loading } from '@/components/ui/loading'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Đổi mật khẩu - Game Cá Cược',
  description: 'Thay đổi mật khẩu tài khoản',
}

export default async function ChangePasswordPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Thay đổi mật khẩu</h1>

      <Card className='max-w-md'>
        <div className='p-6'>
          <Suspense fallback={<Loading />}>
            <ChangePasswordForm />
          </Suspense>
        </div>
      </Card>
    </div>
  )
}

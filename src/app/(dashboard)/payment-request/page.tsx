import { Suspense } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PaymentRequestForm from '@/components/payment/payment-request-form'
import { Loading } from '@/components/ui/loading'

export const metadata = {
  title: 'Yêu cầu nạp tiền - Game Cá Cược',
  description: 'Gửi yêu cầu nạp tiền vào tài khoản Game Cá Cược',
}

export default async function PaymentRequestPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Yêu cầu nạp tiền</h1>

      <Suspense fallback={<Loading />}>
        <PaymentRequestForm userId={session.user.id} />
      </Suspense>
    </div>
  )
}

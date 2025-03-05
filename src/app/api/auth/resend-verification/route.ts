// src/app/api/auth/resend-verification/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Gửi email xác minh
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error sending verification email' },
        { status: 400 }
      )
    }

    // Ghi log
    await supabase.from('system_logs').insert({
      action_type: 'verification_email_sent',
      user_id: user.id,
      description: `Verification email sent to: ${email}`,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Verification email sent successfully',
    })
  } catch (error: any) {
    console.error('Error sending verification email:', error)
    return NextResponse.json(
      { error: error.message || 'Error sending verification email' },
      { status: 500 }
    )
  }
}

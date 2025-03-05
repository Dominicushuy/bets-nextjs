// src/app/api/auth/verify-email/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const supabase = createClient()

    // Xác minh email bằng token
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Ghi log
    await supabase.from('system_logs').insert({
      action_type: 'email_verified',
      description: 'User verified their email',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Email verified successfully' })
  } catch (error: any) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: error.message || 'Error verifying email' },
      { status: 500 }
    )
  }
}

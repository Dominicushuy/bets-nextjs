// src/app/api/auth/update-user/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { displayName, email, phone } = await req.json()

    if (!displayName && !email && !phone) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Lấy thông tin user hiện tại
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cập nhật thông tin trong Auth
    const authUpdates: any = {}
    if (email) authUpdates.email = email

    let authUpdateError = null
    if (Object.keys(authUpdates).length > 0) {
      const { error } = await supabase.auth.updateUser(authUpdates)
      authUpdateError = error
    }

    // Cập nhật profile
    const profileUpdates: any = {}
    if (displayName) profileUpdates.display_name = displayName
    if (phone) profileUpdates.phone = phone

    let profileUpdateError = null
    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      profileUpdateError = error
    }

    if (authUpdateError || profileUpdateError) {
      return NextResponse.json(
        {
          error:
            authUpdateError?.message ||
            profileUpdateError?.message ||
            'Error updating user information',
        },
        { status: 500 }
      )
    }

    // Ghi log
    await supabase.from('system_logs').insert({
      action_type: 'user_updated',
      user_id: user.id,
      description: 'User information updated',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'User information updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating user information:', error)
    return NextResponse.json(
      { error: error.message || 'Error updating user information' },
      { status: 500 }
    )
  }
}

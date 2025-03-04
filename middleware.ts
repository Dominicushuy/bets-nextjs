// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Đường dẫn hiện tại
  const path = req.nextUrl.pathname

  // Kiểm tra các routes được bảo vệ
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Kiểm tra quyền admin
    if (path.startsWith('/admin')) {
      // Lấy profile để kiểm tra role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  // Nếu đã đăng nhập và truy cập trang login/register, chuyển hướng đến dashboard
  if (session && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Chỉ định các routes sẽ trigger middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}

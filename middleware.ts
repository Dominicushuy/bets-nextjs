// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Kiểm tra session và chuyển hướng nếu cần
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Lấy đường dẫn yêu cầu
  const path = req.nextUrl.pathname

  // Danh sách các đường dẫn công khai (không cần đăng nhập)
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/',
  ]

  // Kiểm tra xem đường dẫn hiện tại có phải là đường dẫn công khai hay không
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  )

  // Nếu không có session và đường dẫn không phải là đường dẫn công khai, chuyển hướng đến trang đăng nhập
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Nếu có session và đang ở đường dẫn công khai (trừ trang chủ), chuyển hướng đến dashboard
  if (session && isPublicPath && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Nếu đường dẫn bắt đầu bằng /admin, kiểm tra quyền admin
  if (path.startsWith('/admin')) {
    // Nếu không có session, chuyển hướng đến trang đăng nhập
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Kiểm tra quyền admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Nếu không phải admin, chuyển hướng đến dashboard
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

// Chỉ áp dụng middleware cho các đường dẫn cần kiểm tra
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/* (public files)
     * - api/* (API routes that handle authentication themselves)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}

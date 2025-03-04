// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Kiểm tra xác thực cho routes thuộc về dashboard và admin
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isGameRoute = req.nextUrl.pathname.startsWith("/games");
  const isHistoryRoute = req.nextUrl.pathname.startsWith("/history");
  const isProfileRoute = req.nextUrl.pathname.startsWith("/profile");
  const isPaymentRoute = req.nextUrl.pathname.startsWith("/payment-request");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  const isProtectedRoute =
    isDashboardRoute ||
    isGameRoute ||
    isHistoryRoute ||
    isProfileRoute ||
    isPaymentRoute ||
    isAdminRoute;

  // Nếu là route cần xác thực nhưng chưa đăng nhập
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Kiểm tra quyền admin cho các route admin
  if (isAdminRoute && session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    // Nếu không phải admin, redirect về dashboard
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

// Chỉ áp dụng middleware cho các route sau
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/games/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/payment-request/:path*",
    "/admin/:path*",
  ],
};

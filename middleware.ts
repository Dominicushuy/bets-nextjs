// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes yêu cầu xác thực
const authRequiredRoutes = [
  "/dashboard",
  "/profile",
  "/games",
  "/payment-request",
  "/rewards",
  "/promotions",
  "/history",
];

// Routes chỉ dành cho admin
const adminOnlyRoutes = ["/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Tạo Supabase client với cookies từ request
  const supabase = createMiddlewareClient({ req, res });

  // Kiểm tra session hiện tại
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Lấy pathname từ request URL
  const { pathname } = req.nextUrl;

  // Kiểm tra xem route hiện tại có yêu cầu xác thực không
  const isAuthRoute = authRequiredRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Nếu không có session và route yêu cầu xác thực, chuyển hướng đến trang đăng nhập
  if (!session && isAuthRoute) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Nếu có session mà vào trang đăng nhập hoặc đăng ký, chuyển hướng đến dashboard
  if (
    session &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Kiểm tra quyền admin nếu truy cập route admin
  if (isAdminRoute && session) {
    // Lấy thông tin role từ user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    // Nếu không phải admin, chuyển hướng về dashboard
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

// Chỉ định những routes sẽ áp dụng middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

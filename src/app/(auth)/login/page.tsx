// src/app/(auth)/login/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Đăng nhập
        </h2>
        <p className="text-sm text-gray-600">
          Nhập thông tin đăng nhập của bạn để tiếp tục
        </p>
      </div>

      <div className="mt-8">
        <LoginForm redirectTo={redirectedFrom} />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5 mr-2" fill="#4285F4" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.02 20.38 19.54 18.58C21.06 16.78 21.9 14.49 21.9 12.06C21.9 6.53 17.4 2.04 12 2.04Z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
}

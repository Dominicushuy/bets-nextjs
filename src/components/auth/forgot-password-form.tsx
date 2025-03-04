// src/components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AtSignIcon } from "lucide-react";
import { useRequestPasswordReset } from "@/hooks/auth-hooks";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const {
    mutate: requestReset,
    isPending: isLoading,
    isSuccess,
  } = useRequestPasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Gọi API reset password
    requestReset({ email });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h2>
        <p className="mt-2 text-sm text-gray-600">
          {isSuccess
            ? "Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu cho bạn."
            : "Nhập email để đặt lại mật khẩu của bạn."}
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative mt-1 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSignIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                        text-gray-900 placeholder-gray-400 focus:border-primary-500
                        focus:ring-1 focus:ring-primary-500 transition-all duration-200
                        shadow-sm hover:border-gray-400"
                placeholder="Nhập email đăng ký"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                      transition-all duration-200 text-sm flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700">
            <p>Email đặt lại mật khẩu đã được gửi!</p>
            <p className="text-sm mt-1">
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="mt-4"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}

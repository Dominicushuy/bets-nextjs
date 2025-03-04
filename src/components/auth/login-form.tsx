// src/components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, AtSignIcon, LockIcon } from "lucide-react";
import { useLogin } from "@/hooks/auth-hooks";

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({
  redirectTo = "/dashboard",
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate: login, isPending: isLoading } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push(redirectTo);
        },
      }
    );
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="relative">
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
            placeholder="Nhập email của bạn"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>
        <div className="relative mt-1 rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-10
                      text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700"
        >
          Ghi nhớ đăng nhập
        </label>
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
            "Đăng nhập"
          )}
        </Button>
      </div>
    </form>
  );
}

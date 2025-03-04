// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Kiểm tra hash từ URL để biết là đã có token reset password chưa
  useEffect(() => {
    const checkResetToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Không có session, kiểm tra URL có hash không
        const hash = window.location.hash;
        if (!hash || !hash.includes("type=recovery")) {
          setMessage("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        }
      }
    };

    checkResetToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      toast.success("Mật khẩu đã được cập nhật thành công!");

      // Chờ 1 giây rồi điều hướng để toast kịp hiển thị
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(
        error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          {message}
        </div>
        <Button
          onClick={() => router.push("/forgot-password")}
          className="mt-4"
        >
          Yêu cầu link đặt lại mật khẩu mới
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
        <p className="mt-2 text-sm text-gray-600">Nhập mật khẩu mới của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mật khẩu mới
          </label>
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
              placeholder="Nhập mật khẩu mới"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative mt-1 rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-10
                      text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                    transition-all duration-200 text-sm flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
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
              "Cập nhật mật khẩu"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

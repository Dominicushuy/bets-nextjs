"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Kiểm tra xem đã có tham số ref trong URL không (để nhận mã giới thiệu)
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  // Nếu người dùng đã đăng nhập, chuyển hướng đến dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Nếu đang tải thông tin xác thực, hiển thị loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Tạo tài khoản mới
        </h2>
        <p className="text-sm text-gray-600">
          Đăng ký để trải nghiệm nền tảng game cá cược
        </p>
        {referralCode && (
          <div className="mt-2 p-2 bg-primary-50 text-primary-700 rounded-md text-sm">
            Bạn đang sử dụng mã giới thiệu: <strong>{referralCode}</strong>
          </div>
        )}
      </div>

      <RegisterForm initialReferralCode={referralCode} />
    </>
  );
}

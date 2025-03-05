// src/app/(auth)/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kiểm tra người dùng đã đăng nhập chưa
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Nếu đã đăng nhập, redirect về dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Game Cá Cược
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Game Cá Cược - Nền tảng cá cược trực tuyến an toàn và công bằng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

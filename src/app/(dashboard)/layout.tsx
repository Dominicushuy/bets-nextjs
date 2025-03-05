import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Navbar from "@/components/layouts/main-layout";
import Footer from "@/components/layouts/footer";
import { Loading } from "@/components/ui/loading";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy thông tin người dùng từ server
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Nếu chưa đăng nhập, redirect về trang login
  if (!session) {
    redirect("/login");
  }

  // Lấy thông tin profile để hiển thị
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar profile={profile} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

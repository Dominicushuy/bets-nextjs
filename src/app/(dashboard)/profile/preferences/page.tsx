// src/app/(dashboard)/profile/preferences/page.tsx
import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import PreferencesForm from "@/components/profile/preferences-form";

export const metadata = {
  title: "Cài đặt tài khoản - Game Cá Cược",
  description: "Tùy chỉnh cài đặt tài khoản của bạn trên Game Cá Cược",
};

export default async function PreferencesPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cài đặt tài khoản</h1>

      <Suspense fallback={<Loading />}>
        <PreferencesForm userId={session.user.id} />
      </Suspense>
    </div>
  );
}

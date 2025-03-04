// src/app/api/auth/login/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Cập nhật last_login trong profile
    await supabase
      .from("profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.user.id);

    // Ghi log đăng nhập thành công
    await supabase.from("system_logs").insert({
      user_id: data.user.id,
      action_type: "login",
      description: "Đăng nhập thành công",
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Error signing in:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi đăng nhập" },
      { status: 500 }
    );
  }
}

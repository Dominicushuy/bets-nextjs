// src/app/api/auth/phone-login/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Số điện thoại và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Trước tiên, tìm user có số điện thoại trùng khớp trong bảng profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("phone", phone)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản với số điện thoại này" },
        { status: 400 }
      );
    }

    // Đăng nhập sử dụng email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profileData.email,
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
      description: "Đăng nhập thành công với số điện thoại",
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Error signing in with phone:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi đăng nhập" },
      { status: 500 }
    );
  }
}

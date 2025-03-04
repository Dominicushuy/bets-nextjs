// src/app/api/auth/reset-password/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient();

    // Gửi email đặt lại mật khẩu
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Ghi log
    await supabase.from("system_logs").insert({
      action_type: "password_reset_request",
      description: `Password reset requested for email: ${email}`,
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send reset password email" },
      { status: 500 }
    );
  }
}

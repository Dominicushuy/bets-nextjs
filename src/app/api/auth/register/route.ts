// src/app/api/auth/register/route.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation cho dữ liệu đăng ký
const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .min(1, "Số điện thoại là bắt buộc"),
  display_name: z.string().optional(),
  referral_code: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, phone, display_name, referral_code } =
      validationResult.data;

    // Khởi tạo admin client để có đủ quyền thực hiện các thao tác
    const supabaseAdmin = createAdminClient();

    // 1. Kiểm tra cả email và phone cùng lúc để tối ưu hiệu suất
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, phone")
      .or(`email.eq.${email},phone.eq.${phone}`);

    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Lỗi khi kiểm tra thông tin người dùng" },
        { status: 500 }
      );
    }

    // Kiểm tra xem có tồn tại user với email hoặc phone không
    if (existingUsers && existingUsers.length > 0) {
      const existingEmail = existingUsers.some((user) => user.email === email);
      const existingPhone = existingUsers.some((user) => user.phone === phone);

      if (existingEmail && existingPhone) {
        return NextResponse.json(
          { error: "Email và số điện thoại đã được sử dụng" },
          { status: 400 }
        );
      } else if (existingEmail) {
        return NextResponse.json(
          { error: "Email đã được sử dụng" },
          { status: 400 }
        );
      } else if (existingPhone) {
        return NextResponse.json(
          { error: "Số điện thoại đã được sử dụng" },
          { status: 400 }
        );
      }
    }

    // 2. Đăng ký người dùng mới trong Supabase Auth
    const { data: authData, error: signUpError } =
      await supabaseAdmin.auth.admin.createUser({
        phone: `+84${phone.slice(-9)}`, // Format số điện thoại thành chuẩn E.164
        email,
        password,
        email_confirm: true, // Tự động xác nhận email
        user_metadata: {
          phone, // Lưu số điện thoại vào metadata để đảm bảo có sẵn nếu trigger thất bại
          display_name: display_name || phone, // Lưu display_name vào metadata
        },
      });

    if (signUpError || !authData.user) {
      console.error("Error signing up:", signUpError);
      return NextResponse.json(
        { error: signUpError?.message || "Lỗi khi đăng ký tài khoản" },
        { status: 500 }
      );
    }

    // 3. Tạo profile cho người dùng mới
    const { error: insertError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      email,
      phone,
      display_name: display_name || phone,
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error creating profile:", insertError);
    }

    // 4. Xử lý mã giới thiệu nếu có
    if (referral_code) {
      try {
        // Tìm người giới thiệu từ mã code
        const { data: referrerData, error: referrerError } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("referral_code", referral_code)
          .single();

        if (referrerError) {
          console.error("Error finding referrer:", referrerError);
          // Chỉ log lỗi, không làm gián đoạn quá trình đăng ký
        } else if (referrerData && referrerData.id !== authData.user.id) {
          // Đảm bảo không tự giới thiệu chính mình
          // Cập nhật referred_by trong profiles
          await supabaseAdmin
            .from("profiles")
            .update({
              referred_by: referrerData.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", authData.user.id);

          // Tạo bản ghi giới thiệu
          await supabaseAdmin.from("referrals").insert({
            referrer_id: referrerData.id,
            referred_id: authData.user.id,
            status: "pending",
            created_at: new Date().toISOString(),
          });

          // Tạo thông báo cho người giới thiệu
          await supabaseAdmin.from("notifications").insert({
            user_id: referrerData.id,
            title: "Giới thiệu mới",
            message: "Một người dùng mới đã sử dụng mã giới thiệu của bạn.",
            type: "system",
            is_read: false,
            created_at: new Date().toISOString(),
          });
        }
      } catch (referralError) {
        console.error("Error processing referral code:", referralError);
        // Không làm gián đoạn quá trình đăng ký nếu xử lý mã giới thiệu lỗi
      }
    }

    // 5. Ghi log hệ thống
    try {
      await supabaseAdmin.from("system_logs").insert({
        action_type: "user_registered",
        description: `User registered with email: ${email} and phone: ${phone}`,
        user_id: authData.user.id,
        ip_address: req.ip || req.headers.get("x-forwarded-for") || "",
        timestamp: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Error logging user registration:", logError);
      // Không làm gián đoạn quá trình đăng ký nếu ghi log lỗi
    }

    // 6. Xử lý thành công, trả về thông tin người dùng (không bao gồm mật khẩu)
    return NextResponse.json({
      message: "Đăng ký thành công",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        phone,
        display_name: display_name || phone,
      },
    });
  } catch (error: any) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định khi đăng ký" },
      { status: 500 }
    );
  }
}

// src/app/api/upload/route.ts - Cải tiến
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Lấy thông tin người dùng đang đăng nhập
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "payment_proof"; // Mặc định là payment_proof

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Tạo tên file độc nhất
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${uuidv4()}.${fileExt}`;
    const bucket = type === "avatar" ? "user_avatars" : "payment_proofs";

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload lên Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Error uploading file" },
        { status: 500 }
      );
    }

    // Lấy URL công khai
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Nếu đây là avatar, cập nhật thông tin profile
    if (type === "avatar") {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile with avatar:", profileError);
        // Chúng ta vẫn trả về URL đã upload, nhưng log lỗi
      }
    }

    // Ghi log
    await supabase.from("system_logs").insert({
      action_type: "file_upload",
      description: `User uploaded file of type ${type}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      url: urlData.publicUrl,
      path: fileName,
      success: true,
      bucket,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}

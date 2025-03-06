// src/app/api/profile/avatar/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Giới hạn kích thước file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must not exceed 5MB" },
        { status: 400 }
      );
    }

    // Tạo tên file độc nhất
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

    // Convert file to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload file lên storage
    const { error: uploadError } = await supabase.storage
      .from("user_avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Lấy URL công khai
    const { data: urlData } = supabase.storage
      .from("user_avatars")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Cập nhật profile với avatar URL mới
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Avatar updated successfully",
      avatar_url: publicUrl,
      profile: data,
    });
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: error.message || "Error uploading avatar" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy thông tin profile hiện tại để lấy URL avatar
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    if (profile?.avatar_url) {
      // Extract path từ URL
      const urlParts = profile.avatar_url.split("user_avatars/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        // Xóa file từ storage
        const { error: deleteError } = await supabase.storage
          .from("user_avatars")
          .remove([filePath]);

        if (deleteError) {
          console.error("Error deleting avatar from storage:", deleteError);
        }
      }
    }

    // Cập nhật profile xóa avatar_url
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Avatar removed successfully",
      profile: data,
    });
  } catch (error: any) {
    console.error("Error removing avatar:", error);
    return NextResponse.json(
      { error: error.message || "Error removing avatar" },
      { status: 500 }
    );
  }
}

// src/app/api/notifications/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Xây dựng query
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    // Lọc theo trạng thái đọc nếu có yêu cầu
    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching notifications" },
      { status: 500 }
    );
  }
}

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
    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Error fetching user profile" },
        { status: 500 }
      );
    }

    if (profile.role !== "admin") {
      return NextResponse.json(
        { error: "Only admin can create notifications" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      user_id,
      title,
      message,
      type = "system",
      related_resource_id,
      related_resource_type,
      expires_at,
    } = body;

    if (!user_id || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Tạo thông báo mới
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id,
        title,
        message,
        type,
        related_resource_id,
        related_resource_type,
        expires_at,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: error.message || "Error creating notification" },
      { status: 500 }
    );
  }
}

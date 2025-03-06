// src/app/api/profile/level-progress/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy profile người dùng
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, level, experience_points")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    try {
      // Lấy thông tin level hiện tại
      const { data: currentLevel, error: currentLevelError } = await supabase
        .from("user_levels")
        .select("*")
        .eq("level", profile.level)
        .single();

      if (currentLevelError) {
        return NextResponse.json(
          { error: currentLevelError.message },
          { status: 500 }
        );
      }

      // Lấy thông tin level tiếp theo
      const { data: nextLevel, error: nextLevelError } = await supabase
        .from("user_levels")
        .select("*")
        .eq("level", profile.level + 1)
        .single();

      // Nếu không có level tiếp theo (đã đạt cấp độ cao nhất)
      if (nextLevelError && nextLevelError.code === "PGRST116") {
        return NextResponse.json({
          currentXP: profile.experience_points,
          currentLevel: profile.level,
          currentLevelName: currentLevel.name,
          currentLevelXP: currentLevel.experience_required,
          nextLevelXP: null,
          remainingXP: null,
          progress: 100,
          isMaxLevel: true,
        });
      }

      if (nextLevelError) {
        return NextResponse.json(
          { error: nextLevelError.message },
          { status: 500 }
        );
      }

      // Tính toán tiến trình
      const currentXP = profile.experience_points;
      const levelStartXP = currentLevel.experience_required;
      const nextLevelXP = nextLevel.experience_required;
      const totalNeededForLevel = nextLevelXP - levelStartXP;
      const alreadyEarnedInLevel = currentXP - levelStartXP;
      const remainingXP = nextLevelXP - currentXP;
      const progress = Math.min(
        100,
        Math.max(
          0,
          Math.floor((alreadyEarnedInLevel / totalNeededForLevel) * 100)
        )
      );

      return NextResponse.json({
        currentXP,
        currentLevel: profile.level,
        currentLevelName: currentLevel.name,
        currentLevelXP: levelStartXP,
        nextLevelXP,
        nextLevelName: nextLevel.name,
        remainingXP,
        progress,
        isMaxLevel: false,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Error calculating level progress" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching level progress:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching level progress" },
      { status: 500 }
    );
  }
}

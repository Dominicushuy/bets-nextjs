// src/providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { ExtendedProfile } from "@/types/database";

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null;
  profile: ExtendedProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Tạo Context với giá trị mặc định undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Hàm lấy thông tin profile người dùng
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra session khi component được mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    getSession();

    // Bắt sự kiện thay đổi trạng thái đăng nhập
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }

      // Refresh trang để cập nhật server data
      router.refresh();
    });

    // Cleanup subscription khi component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Hàm đăng nhập
  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  // Hàm đăng xuất
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Hàm làm mới thông tin profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Giá trị cung cấp cho Context
  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Gift,
  CreditCard,
  Bell,
  Settings,
  Home,
  ChevronDown,
  ChevronRight,
  DollarSign,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [gamesOpen, setGamesOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white w-64 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="py-6 px-4 border-b border-gray-200">
        <Link href="/admin/dashboard">
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-primary-600">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-4 space-y-1">
        <Link href="/admin/dashboard">
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/admin/dashboard")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </div>
        </Link>

        <Link href="/admin/users">
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/admin/users")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            <span className="font-medium">Người dùng</span>
          </div>
        </Link>

        {/* Games Submenu */}
        <div>
          <button
            onClick={() => setGamesOpen(!gamesOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
              isActive("/admin/games")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3" />
              <span className="font-medium">Lượt chơi</span>
            </div>
            {gamesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {gamesOpen && (
            <div className="pl-10 mt-1 space-y-1">
              <Link href="/admin/games">
                <div
                  className={`flex items-center px-3 py-2 rounded-md ${
                    pathname === "/admin/games"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">Tất cả lượt chơi</span>
                </div>
              </Link>
              <Link href="/admin/games/new">
                <div
                  className={`flex items-center px-3 py-2 rounded-md ${
                    pathname === "/admin/games/new"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">Tạo lượt chơi mới</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Payments Submenu */}
        <div>
          <button
            onClick={() => setPaymentsOpen(!paymentsOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
              isActive("/admin/payment-requests")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3" />
              <span className="font-medium">Thanh toán</span>
            </div>
            {paymentsOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {paymentsOpen && (
            <div className="pl-10 mt-1 space-y-1">
              <Link href="/admin/payment-requests">
                <div
                  className={`flex items-center px-3 py-2 rounded-md ${
                    pathname === "/admin/payment-requests"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">Yêu cầu nạp tiền</span>
                </div>
              </Link>
              <Link href="/admin/payment-reports">
                <div
                  className={`flex items-center px-3 py-2 rounded-md ${
                    pathname === "/admin/payment-reports"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">Báo cáo thanh toán</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/rewards">
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/admin/rewards")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Gift className="h-5 w-5 mr-3" />
            <span className="font-medium">Phần thưởng</span>
          </div>
        </Link>

        <Link href="/admin/promotions">
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/admin/promotions")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            <span className="font-medium">Khuyến mãi</span>
          </div>
        </Link>

        <Link href="/admin/logs">
          <div
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/admin/logs")
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Bell className="h-5 w-5 mr-3" />
            <span className="font-medium">Nhật ký hệ thống</span>
          </div>
        </Link>

        <hr className="my-4 border-gray-200" />

        <Link href="/dashboard">
          <div className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Home className="h-5 w-5 mr-3" />
            <span className="font-medium">Về trang chủ</span>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
}

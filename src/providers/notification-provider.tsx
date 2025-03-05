// src/providers/notification-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { Notification } from "@/types/database";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./auth-provider";
import { Bell, CheckCircle, CreditCard, Gift, AlertCircle } from "lucide-react";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  isLoading: boolean;
  getNotificationDetails: (notification: Notification) => {
    icon: JSX.Element;
    color: string;
    actionLink?: string;
  };
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Không thể đánh dấu đã đọc. Vui lòng thử lại.");
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.");
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      const deletedNotification = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo. Vui lòng thử lại.");
    }
  };

  // Get notification details based on type
  const getNotificationDetails = useCallback((notification: Notification) => {
    let icon = <Bell className="h-5 w-5" />;
    let color = "text-blue-500";
    let actionLink;

    switch (notification.type) {
      case "game":
        icon = <CheckCircle className="h-5 w-5" />;
        color = "text-green-500";
        // If there's a related resource (like a game), create a link
        if (
          notification.related_resource_id &&
          notification.related_resource_type === "game_round"
        ) {
          actionLink = `/games/${notification.related_resource_id}`;
        }
        break;
      case "payment":
        icon = <CreditCard className="h-5 w-5" />;
        color = "text-purple-500";
        if (
          notification.related_resource_id &&
          notification.related_resource_type === "payment_request"
        ) {
          actionLink = `/history`;
        }
        break;
      case "reward":
        icon = <Gift className="h-5 w-5" />;
        color = "text-yellow-500";
        if (
          notification.related_resource_id &&
          notification.related_resource_type === "reward_code"
        ) {
          actionLink = `/rewards`;
        }
        break;
      case "system":
      default:
        icon = <AlertCircle className="h-5 w-5" />;
        color = "text-blue-500";
        break;
    }

    return { icon, color, actionLink };
  }, []);

  // Custom handler for displaying notification toasts with appropriate styling
  const handleNotificationToast = useCallback(
    (notification: Notification) => {
      const { icon, color } = getNotificationDetails(notification);

      // Custom toast styles based on notification type
      const toastStyles: { [key: string]: any } = {
        game: { style: { backgroundColor: "#10b981", color: "white" } },
        payment: { style: { backgroundColor: "#8b5cf6", color: "white" } },
        reward: { style: { backgroundColor: "#f59e0b", color: "white" } },
        system: { style: { backgroundColor: "#3b82f6", color: "white" } },
      };

      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${color}`}>{icon}</div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ),
        { duration: 5000, ...(toastStyles[notification.type] || {}) }
      );
    },
    [getNotificationDetails]
  );

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    // Clean up expired notifications
    const cleanupExpiredNotifications = async () => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id)
        .lt("expires_at", now);

      if (error) {
        console.error("Error cleaning up expired notifications:", error);
      } else {
        // Refresh the notifications list
        fetchNotifications();
      }
    };

    cleanupExpiredNotifications();

    // Real-time subscription
    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show custom toast for new notification
          handleNotificationToast(newNotification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient, handleNotificationToast]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
    getNotificationDetails,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

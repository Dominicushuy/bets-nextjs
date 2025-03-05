// src/hooks/notification-hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { Notification } from "@/types/database";

// Keys for React Query caching
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: any) => [...notificationKeys.lists(), { filters }] as const,
  details: () => [...notificationKeys.all, "detail"] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  counts: () => [...notificationKeys.all, "counts"] as const,
};

/**
 * Hook to fetch notifications
 */
export const useNotificationList = (limit = 20) => {
  return useQuery({
    queryKey: notificationKeys.list({ limit }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Notification[];
    },
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.counts(),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: any) => {
      console.error("Error marking notification as read:", error);
      toast.error("Không thể đánh dấu đã đọc. Vui lòng thử lại.");
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    },
    onError: (error: any) => {
      console.error("Error marking all notifications as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.");
    },
  });
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: any) => {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo. Vui lòng thử lại.");
    },
  });
};

// src/services/notification-service.ts
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types/database";

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId: string, limit = 20) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
  return count || 0;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  userId: string,
  notificationId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  notificationData: {
    title: string;
    message: string;
    type: "system" | "game" | "payment" | "reward" | "promotion";
    related_resource_id?: string;
    related_resource_type?: string;
    expires_at?: string;
  }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      related_resource_id: notificationData.related_resource_id,
      related_resource_type: notificationData.related_resource_type,
      expires_at: notificationData.expires_at,
      is_read: false,
    })
    .select();

  if (error) throw error;
  return data;
}

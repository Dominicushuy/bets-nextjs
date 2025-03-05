// src/components/ui/notification.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Badge } from "./badge";
import { Notification } from "@/types/database";
import { formatDateTime } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  className,
}: NotificationItemProps) {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "system":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "payment":
        return <AlertCircle className="h-5 w-5 text-green-500" />;
      case "game":
        return <Bell className="h-5 w-5 text-primary-500" />;
      case "reward":
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors",
        !notification.is_read && "bg-blue-50",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">{getNotificationIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatDateTime(notification.created_at)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <div className="mt-2 flex items-center">
            {!notification.is_read && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="inline-flex items-center text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                <Check className="h-3 w-3 mr-1" />
                Đánh dấu đã đọc
              </button>
            )}
            {notification.is_read && (
              <Badge variant="info" size="xs" className="mr-2">
                Đã đọc
              </Badge>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(notification.id)}
                className="ml-auto inline-flex items-center text-xs text-red-600 hover:text-red-800 font-medium"
              >
                <X className="h-3 w-3 mr-1" />
                Xóa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  emptyMessage = "Không có thông báo nào",
  className,
}: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className={cn("divide-y divide-gray-200", className)}>
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
      ) : (
        <>
          {hasUnread && onMarkAllAsRead && (
            <div className="p-2 bg-gray-50 text-right">
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            </div>
          )}
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({
  count = 0,
  onClick,
  className,
}: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full",
        className
      )}
    >
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

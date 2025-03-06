"use client";

import { useState, useRef, useEffect } from "react";
import {
  NotificationBell,
  NotificationList,
} from "@/components/ui/notification";
import { useNotifications } from "@/providers/notification-provider";
import { Button } from "@/components/ui/button";
import { useOnClickOutside } from "@/hooks/use-click-outside";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Handle click outside to close dropdown
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Close dropdown when escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBell
        count={unreadCount}
        onClick={handleToggleDropdown}
        className="relative"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              emptyMessage="Bạn không có thông báo nào"
            />
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full text-sm"
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

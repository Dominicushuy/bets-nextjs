// src/components/profile/preferences-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useUserPreferences,
  useUpdateUserPreferences,
} from "@/hooks/profile-hooks";
import { Bell, Moon, Globe, Shield } from "lucide-react";

interface PreferencesFormProps {
  userId: string;
}

export default function PreferencesForm({ userId }: PreferencesFormProps) {
  const router = useRouter();
  const { data: initialPreferences, isLoading } = useUserPreferences(userId);
  const { mutate: updatePreferences, isPending: isUpdating } =
    useUpdateUserPreferences();

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      app: true,
      marketing: false,
    },
    appearance: {
      darkMode: false,
      compactView: false,
    },
    privacy: {
      showActivity: true,
      showBalance: true,
    },
    language: "vi",
  });

  // Cập nhật state khi có dữ liệu từ API
  useEffect(() => {
    if (initialPreferences && !isLoading) {
      setPreferences((prev) => ({
        ...prev,
        ...initialPreferences,
      }));
    }
  }, [initialPreferences, isLoading]);

  const handleToggleChange = (section: string, key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: !(prev[section as keyof typeof prev] as any)[key],
      },
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences((prev) => ({
      ...prev,
      language: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updatePreferences(
      { userId, preferences },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (error: any) => {
          toast.error(`Không thể cập nhật cài đặt: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Bell className="mr-2 h-5 w-5 text-primary-500" />
            Thông báo
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="notifications-email"
                className="text-sm font-medium text-gray-700"
              >
                Nhận thông báo qua email
              </label>
              <Switch
                id="notifications-email"
                checked={preferences.notifications.email}
                onChange={() => handleToggleChange("notifications", "email")}
              />
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="notifications-app"
                className="text-sm font-medium text-gray-700"
              >
                Thông báo trong ứng dụng
              </label>
              <Switch
                id="notifications-app"
                checked={preferences.notifications.app}
                onChange={() => handleToggleChange("notifications", "app")}
              />
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="notifications-marketing"
                className="text-sm font-medium text-gray-700"
              >
                Nhận thông tin khuyến mãi
              </label>
              <Switch
                id="notifications-marketing"
                checked={preferences.notifications.marketing}
                onChange={() =>
                  handleToggleChange("notifications", "marketing")
                }
              />
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Appearance Settings */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Moon className="mr-2 h-5 w-5 text-primary-500" />
            Giao diện
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="appearance-darkMode"
                className="text-sm font-medium text-gray-700"
              >
                Chế độ tối
              </label>
              <Switch
                id="appearance-darkMode"
                checked={preferences.appearance.darkMode}
                onChange={() => handleToggleChange("appearance", "darkMode")}
              />
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="appearance-compactView"
                className="text-sm font-medium text-gray-700"
              >
                Giao diện thu gọn
              </label>
              <Switch
                id="appearance-compactView"
                checked={preferences.appearance.compactView}
                onChange={() => handleToggleChange("appearance", "compactView")}
              />
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Shield className="mr-2 h-5 w-5 text-primary-500" />
            Quyền riêng tư
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="privacy-showActivity"
                className="text-sm font-medium text-gray-700"
              >
                Hiển thị hoạt động của tôi với người khác
              </label>
              <Switch
                id="privacy-showActivity"
                checked={preferences.privacy.showActivity}
                onChange={() => handleToggleChange("privacy", "showActivity")}
              />
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="privacy-showBalance"
                className="text-sm font-medium text-gray-700"
              >
                Hiển thị số dư với người khác
              </label>
              <Switch
                id="privacy-showBalance"
                checked={preferences.privacy.showBalance}
                onChange={() => handleToggleChange("privacy", "showBalance")}
              />
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Language Settings */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Globe className="mr-2 h-5 w-5 text-primary-500" />
            Ngôn ngữ
          </h3>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngôn ngữ hiển thị
            </label>
            <select
              id="language"
              value={preferences.language}
              onChange={handleLanguageChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
          >
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Card>
  );
}

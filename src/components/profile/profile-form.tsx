// src/components/profile/profile-form.tsx - Cải tiến
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  useUpdateUserProfile,
  useUploadProfileAvatar,
} from "@/hooks/profile-hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Camera, Mail, Phone, User } from "lucide-react";
import { ExtendedProfile } from "@/types/database";

interface ProfileFormProps {
  initialData: ExtendedProfile;
  userId: string;
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  );

  // Mutations
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile();
  const { mutate: uploadAvatar, isPending: isUploading } =
    useUploadProfileAvatar();

  // Đang xử lý
  const isProcessing = isUpdating || isUploading;

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý click vào avatar để mở file input
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý upload avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Nếu có thay đổi avatar, upload trước
      if (avatarFile) {
        uploadAvatar(
          { userId, file: avatarFile },
          {
            onSuccess: () => {
              setAvatarFile(null);
              toast.success("Avatar đã được cập nhật thành công");
            },
            onError: (error: any) => {
              toast.error(`Lỗi khi tải lên avatar: ${error.message}`);
            },
          }
        );
      }

      // Kiểm tra xem có thay đổi các trường thông tin hay không
      const hasProfileChanges =
        initialData?.display_name !== formData.display_name;

      // Chỉ gọi API cập nhật nếu có thay đổi
      if (hasProfileChanges) {
        updateProfile(
          {
            userId,
            updates: {
              display_name: formData.display_name,
              // email và phone có thể cần xử lý đặc biệt vì liên quan đến auth
            },
          },
          {
            onSuccess: () => {
              toast.success("Thông tin hồ sơ đã được cập nhật");
              router.refresh();
            },
            onError: (error: any) => {
              toast.error(`Không thể cập nhật hồ sơ: ${error.message}`);
            },
          }
        );
      } else if (!avatarFile) {
        toast.error("Không có thông tin nào được thay đổi");
      }
    } catch (error: any) {
      toast.error(`Lỗi khi cập nhật hồ sơ: ${error.message}`);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar
              src={avatarPreview}
              alt={formData.display_name || "Avatar"}
              size="xl"
              className="h-24 w-24"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-8 w-8 text-white" />
              <input
                ref={fileInputRef}
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isProcessing}
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Nhấp vào ảnh để thay đổi avatar
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên hiển thị
            </label>
            <div className="relative mt-1 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Nhập tên hiển thị"
                className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                          text-gray-900 placeholder-gray-400 focus:border-primary-500
                          focus:ring-1 focus:ring-primary-500 transition-all duration-200
                          shadow-sm hover:border-gray-400"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative mt-1 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                          text-gray-900 placeholder-gray-400 focus:border-primary-500
                          focus:ring-1 focus:ring-primary-500 transition-all duration-200
                          shadow-sm hover:border-gray-400 bg-gray-50"
                disabled={true} // Email liên quan đến auth nên không cho sửa trực tiếp
              />
            </div>
            {!formData.email && (
              <p className="mt-1 text-sm text-red-600">
                Email là bắt buộc cho tài khoản của bạn
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <div className="relative mt-1 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                          text-gray-900 placeholder-gray-400 focus:border-primary-500
                          focus:ring-1 focus:ring-primary-500 transition-all duration-200
                          shadow-sm hover:border-gray-400 bg-gray-50"
                disabled={true} // Phone cũng là thông tin xác thực nên không cho sửa trực tiếp
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Lưu ý:</span> Để thay đổi email hoặc
            số điện thoại, vui lòng liên hệ với quản trị viên.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={isProcessing}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

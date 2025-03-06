// src/components/profile/avatar-upload.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Camera, X } from "lucide-react";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  onAvatarChange,
  size = "lg",
}: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentAvatarUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map size to dimensions
  const sizeMap = {
    sm: "h-16 w-16",
    md: "h-20 w-20",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRemoving) return;

    // Nếu chưa có avatar trên server (chỉ có preview), chỉ cần xóa local
    if (!currentAvatarUrl) {
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Nếu có avatar trên server, gọi API xóa
    setIsRemoving(true);
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error removing avatar");
      }

      setAvatarPreview(null);
      onAvatarChange(null);
      toast.success("Avatar đã được xóa thành công");
    } catch (error: any) {
      toast.error(`Lỗi khi xóa avatar: ${error.message}`);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Tạo preview
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        // Upload file
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/profile/avatar", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error uploading avatar");
          }

          const result = await response.json();
          onAvatarChange(result.avatar_url);
          toast.success("Avatar đã được cập nhật thành công");
        } catch (error: any) {
          toast.error(`Lỗi khi tải lên avatar: ${error.message}`);
          // Revert preview on error
          setAvatarPreview(currentAvatarUrl);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [currentAvatarUrl, onAvatarChange]
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative group cursor-pointer ${
          isUploading || isRemoving ? "opacity-70" : ""
        }`}
        onClick={handleAvatarClick}
      >
        <Avatar
          src={avatarPreview}
          alt="Avatar"
          className={`${sizeMap[size]} border-2 border-primary-100`}
          fallback={userId.substring(0, 2).toUpperCase()}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-8 w-8 text-white" />
        </div>
        {avatarPreview && (
          <Button
            variant="danger"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
            onClick={clearAvatar}
            disabled={isUploading || isRemoving}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isUploading || isRemoving}
        />
      </div>
      {isUploading && (
        <div className="mt-2">
          <span className="text-sm text-gray-500">Đang tải lên...</span>
        </div>
      )}
      {isRemoving && (
        <div className="mt-2">
          <span className="text-sm text-gray-500">Đang xóa...</span>
        </div>
      )}
      <p className="mt-2 text-sm text-gray-500">
        Nhấp vào ảnh để thay đổi avatar
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  PhoneIcon,
  AtSignIcon,
  LockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  initialReferralCode?: string | null;
}

export default function RegisterForm({
  initialReferralCode = null,
}: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    display_name: "",
    referral_code: initialReferralCode || "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự";
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      toast.success("Đăng ký thành công!");

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");

      // Kiểm tra lỗi cụ thể và cập nhật errors state
      if (error.message.includes("Email")) {
        setErrors((prev) => ({ ...prev, email: error.message }));
      } else if (error.message.includes("điện thoại")) {
        setErrors((prev) => ({ ...prev, phone: error.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1 rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <AtSignIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full rounded-md border ${
              errors.email ? "border-red-300" : "border-gray-300"
            } py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400`}
            placeholder="Nhập địa chỉ email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1 rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`block w-full rounded-md border ${
              errors.phone ? "border-red-300" : "border-gray-300"
            } py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400`}
            placeholder="Nhập số điện thoại (bắt buộc)"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Số điện thoại của bạn là duy nhất và sẽ được sử dụng để đăng nhập
        </p>
      </div>

      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tên hiển thị (tùy chọn)
        </label>
        <div className="relative mt-1 rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="display_name"
            name="display_name"
            type="text"
            value={formData.display_name}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 
                      text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400"
            placeholder="Nhập tên hiển thị (không bắt buộc)"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu
        </label>
        <div className="relative mt-1 rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={`block w-full rounded-md border ${
              errors.password ? "border-red-300" : "border-gray-300"
            } py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200
                      shadow-sm hover:border-gray-400`}
            placeholder="Tạo mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="referral_code"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mã giới thiệu (tùy chọn)
        </label>
        <input
          id="referral_code"
          name="referral_code"
          type="text"
          value={formData.referral_code}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 py-3 px-4
                    text-gray-900 placeholder-gray-400 focus:border-primary-500
                    focus:ring-1 focus:ring-primary-500 transition-all duration-200
                    shadow-sm hover:border-gray-400"
          placeholder="Nhập mã giới thiệu (nếu có)"
        />
      </div>

      <div>
        <Button
          type="submit"
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                    transition-all duration-200 text-sm flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </div>

      <p className="mt-5 text-center text-sm text-gray-600">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
}

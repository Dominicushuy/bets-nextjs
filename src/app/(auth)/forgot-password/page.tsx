// src/app/(auth)/forgot-password/page.tsx
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <ForgotPasswordForm />
    </div>
  );
}

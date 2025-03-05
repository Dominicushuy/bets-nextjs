// src/app/layout.tsx
import { Inter } from "next/font/google";
import { Metadata } from "next";
import QueryProvider from "@/providers/query-provider";
import ToastProvider from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Cá Cược - Nền tảng betting trực tuyến",
  description:
    "Nền tảng trò chơi cá cược trực tuyến với đa dạng tính năng và trải nghiệm người dùng tối ưu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} h-full`}>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider />
              {children}
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

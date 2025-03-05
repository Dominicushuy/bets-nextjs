import "./styles/globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import ToastProvider from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { NotificationProvider } from "@/providers/notification-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Game Cá Cược - Nền tảng cá cược trực tuyến",
  description:
    "Nền tảng cá cược trực tuyến với đa dạng tính năng và giao diện thân thiện",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
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

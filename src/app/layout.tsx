// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/query-provider'
import ToastProvider from '@/providers/toast-provider'
import { AuthProvider } from '@/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Game Platform',
  description: 'A betting game platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='vi'>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      queryClient.clear() // Xóa tất cả query cache
      toast.success('Đăng xuất thành công')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Không thể đăng xuất. Vui lòng thử lại.')
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      title: 'Tổng quan',
      path: '/admin/dashboard',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      ),
    },
    {
      title: 'Người dùng',
      path: '/admin/users',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      ),
    },
    {
      title: 'Thanh toán',
      path: '/admin/payment-requests',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
    },
    {
      title: 'Lượt chơi',
      path: '/admin/games',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
      ),
    },
    {
      title: 'Phần thưởng',
      path: '/admin/rewards',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
          />
        </svg>
      ),
    },
    {
      title: 'Khuyến mãi',
      path: '/admin/promotions',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
          />
        </svg>
      ),
    },
    {
      title: 'Nhật ký',
      path: '/admin/logs',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
          />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className={`bg-indigo-700 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-screen`}>
      {/* Header */}
      <div className='p-4 flex items-center justify-between'>
        {!collapsed && (
          <Link href='/admin/dashboard' className='font-bold text-xl'>
            Admin Panel
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1 rounded-md hover:bg-indigo-600 ${
            collapsed ? 'w-full flex justify-center' : ''
          }`}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            {collapsed ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 5l7 7-7 7M5 5l7 7-7 7'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className='mt-8'>
        <ul className='px-4 space-y-2'>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center py-2 px-3 rounded-md transition-colors duration-200 ${
                  isActive(item.path) ? 'bg-indigo-800' : 'hover:bg-indigo-600'
                }`}>
                {item.icon}
                {!collapsed && <span className='ml-3'>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className='absolute bottom-0 w-full p-4'>
        <Link
          href='/dashboard'
          className={`flex items-center py-2 px-3 rounded-md hover:bg-indigo-600 transition-colors duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            />
          </svg>
          {!collapsed && <span className='ml-3'>Trang người dùng</span>}
        </Link>

        <button
          onClick={handleSignOut}
          className={`mt-2 flex items-center py-2 px-3 rounded-md hover:bg-indigo-600 transition-colors duration-200 w-full ${
            collapsed ? 'justify-center' : ''
          }`}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
            />
          </svg>
          {!collapsed && <span className='ml-3'>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  )
}

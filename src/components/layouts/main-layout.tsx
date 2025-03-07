'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'
import NotificationDropdown from '@/components/notifications/notification-dropdown'
import { Wallet, Inbox, LineChart, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import LevelBadge from '@/components/user/level-badge'

interface NavbarProps {
  profile: any
}

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = profile?.role === 'admin'

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

  return (
    <nav className='bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                href='/dashboard'
                className='text-xl font-bold text-primary-600'>
                Game Cá Cược
              </Link>
            </div>

            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <Link
                href='/dashboard'
                className={`${
                  isActive('/dashboard')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Trang chủ
              </Link>

              <Link
                href='/games'
                className={`${
                  isActive('/games')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Lượt chơi
              </Link>

              {/* Thêm mục Thống kê & Cấp độ */}
              <Link
                href='/statistics'
                className={`${
                  isActive('/statistics')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                <LineChart className='h-4 w-4 mr-1' />
                Thống kê & Cấp độ
              </Link>

              <Link
                href='/history'
                className={`${
                  isActive('/history')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Lịch sử
              </Link>

              <Link
                href='/rewards'
                className={`${
                  isActive('/rewards')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Phần thưởng
              </Link>
            </div>
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center space-x-4'>
            {/* Balance Display */}
            <div className='flex items-center text-gray-700 pr-4 border-r border-gray-200'>
              <Wallet className='h-5 w-5 text-primary-500 mr-2' />
              <span className='font-medium'>
                {profile?.balance?.toLocaleString()} VND
              </span>
            </div>

            {/* Level Badge */}
            <div className='flex items-center pr-4 border-r border-gray-200'>
              <Award className='h-5 w-5 text-primary-500 mr-2' />
              <LevelBadge
                level={profile?.level || 1}
                size='sm'
                showIcon={true}
              />
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Payment Requests Link */}
            <Link
              href='/payment-request'
              className='relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full'>
              <Inbox className='h-6 w-6' />
              <span className='sr-only'>Nạp tiền</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className='ml-1 relative'>
              <div>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className='flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  id='user-menu-button'
                  aria-expanded={userMenuOpen}
                  aria-haspopup='true'>
                  <span className='sr-only'>Open user menu</span>
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.display_name || profile?.phone || ''}
                    fallback={profile?.phone?.substring(0, 2) || 'U'}
                  />
                </button>
              </div>

              {userMenuOpen && (
                <div
                  className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu-button'
                  tabIndex={-1}>
                  <div className='px-4 py-2 border-b border-gray-200'>
                    <div className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Đăng nhập với</p>
                      <LevelBadge level={profile?.level || 1} size='xs' />
                    </div>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {profile?.phone}
                    </p>
                  </div>

                  <Link
                    href='/profile'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                    onClick={() => setUserMenuOpen(false)}>
                    Hồ sơ cá nhân
                  </Link>

                  <Link
                    href='/statistics'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                    onClick={() => setUserMenuOpen(false)}>
                    <div className='flex items-center'>
                      <LineChart className='h-4 w-4 mr-1' />
                      Thống kê & Cấp độ
                    </div>
                  </Link>

                  <Link
                    href='/profile/change-password'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                    onClick={() => setUserMenuOpen(false)}>
                    Đổi mật khẩu
                  </Link>

                  {isAdmin && (
                    <Link
                      href='/admin/dashboard'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      role='menuitem'
                      onClick={() => setUserMenuOpen(false)}>
                      <div className='flex items-center justify-between'>
                        <span>Quản trị viên</span>
                        <Badge variant='info' size='xs'>
                          Admin
                        </Badge>
                      </div>
                    </Link>
                  )}

                  <div className='border-t border-gray-200 mt-1'>
                    <button
                      onClick={handleSignOut}
                      className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                      role='menuitem'>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='-mr-2 flex items-center sm:hidden'>
            <NotificationDropdown />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
              aria-controls='mobile-menu'
              aria-expanded={mobileMenuOpen}>
              <span className='sr-only'>Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='sm:hidden' id='mobile-menu'>
          <div className='pt-2 pb-3 space-y-1'>
            <Link
              href='/dashboard'
              className={`${
                isActive('/dashboard')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Trang chủ
            </Link>

            <Link
              href='/games'
              className={`${
                isActive('/games')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Lượt chơi
            </Link>

            {/* Thêm mục Thống kê & Cấp độ cho mobile */}
            <Link
              href='/statistics'
              className={`${
                isActive('/statistics')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}>
              <LineChart className='h-4 w-4 mr-2' />
              Thống kê & Cấp độ
            </Link>

            <Link
              href='/history'
              className={`${
                isActive('/history')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Lịch sử
            </Link>

            <Link
              href='/rewards'
              className={`${
                isActive('/rewards')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Phần thưởng
            </Link>

            <Link
              href='/payment-request'
              className={`${
                isActive('/payment-request')
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Nạp tiền
            </Link>
          </div>

          <div className='pt-4 pb-3 border-t border-gray-200'>
            <div className='flex items-center px-4'>
              <div className='flex-shrink-0'>
                <Avatar
                  src={profile?.avatar_url}
                  alt={profile?.display_name || profile?.phone || ''}
                  fallback={profile?.phone?.substring(0, 2) || 'U'}
                />
              </div>
              <div className='ml-3'>
                <div className='text-base font-medium text-gray-800 flex items-center space-x-2'>
                  <span>{profile?.phone}</span>
                  <LevelBadge level={profile?.level || 1} size='xs' />
                </div>
                <div className='text-sm font-medium text-gray-500'>
                  Số dư: {profile?.balance?.toLocaleString()} VND
                </div>
              </div>
            </div>
            <div className='mt-3 space-y-1'>
              <Link
                href='/profile'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
                Hồ sơ cá nhân
              </Link>

              <Link
                href='/statistics'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center'>
                <LineChart className='h-4 w-4 mr-2' />
                Thống kê & Cấp độ
              </Link>

              <Link
                href='/profile/change-password'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
                Đổi mật khẩu
              </Link>

              {isAdmin && (
                <Link
                  href='/admin/dashboard'
                  className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
                  Quản trị viên
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className='block w-full text-left px-4 py-2 text-base font-medium text-red-500 hover:text-red-800 hover:bg-red-50'>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

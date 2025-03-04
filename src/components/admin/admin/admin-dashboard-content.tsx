'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Kiểu dữ liệu cho dashboard summary
interface DashboardSummary {
  totalUsers: number
  activeUsers: number
  pendingPayments: number
  activeGames: number
  completedGames: number
  totalBets: number
  totalPayouts: number
  profit: number
  registrationsToday: number
}

export default function AdminDashboardContent() {
  // Sử dụng React Query để fetch dữ liệu
  const { data, isLoading, error } = useQuery<{ data: DashboardSummary }>({
    queryKey: ['adminDashboardSummary'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard-summary')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <Loading />
  }

  if (error || !data) {
    return (
      <div className='p-4 bg-red-50 text-red-500 rounded-md'>
        Error loading dashboard data. Please try again later.
      </div>
    )
  }

  const summary = data.data

  return (
    <div className='space-y-6'>
      {/* Thống kê tổng quan */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Tổng số người dùng */}
        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Tổng số người dùng
                </p>
                <h3 className='text-3xl font-bold mt-1'>
                  {summary.totalUsers}
                </h3>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-blue-600'
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
              </div>
            </div>
            <div className='mt-2 flex items-center text-sm'>
              <span className='text-green-600 font-medium'>
                +{summary.registrationsToday}
              </span>
              <span className='ml-1 text-gray-500'>Đăng ký hôm nay</span>
            </div>
          </div>
        </Card>

        {/* Người dùng đang hoạt động */}
        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Người dùng hoạt động
                </p>
                <h3 className='text-3xl font-bold mt-1'>
                  {summary.activeUsers}
                </h3>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                  />
                </svg>
              </div>
            </div>
            <div className='mt-2 flex items-center text-sm'>
              <span className='text-gray-500'>trong 30 ngày qua</span>
            </div>
          </div>
        </Card>

        {/* Yêu cầu thanh toán đang chờ */}
        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Yêu cầu thanh toán đang chờ
                </p>
                <h3 className='text-3xl font-bold mt-1'>
                  {summary.pendingPayments}
                </h3>
              </div>
              <div className='bg-yellow-100 p-3 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-yellow-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
            <div className='mt-2'>
              <Link href='/admin/payment-requests'>
                <Button variant='outline' size='sm'>
                  Xem chi tiết
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Trò chơi đang diễn ra */}
        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Trò chơi đang diễn ra
                </p>
                <h3 className='text-3xl font-bold mt-1'>
                  {summary.activeGames}
                </h3>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-purple-600'
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
              </div>
            </div>
            <div className='mt-2'>
              <Link href='/admin/games'>
                <Button variant='outline' size='sm'>
                  Quản lý games
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Thống kê tài chính */}
      <Card className='bg-white'>
        <div className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Thống kê tài chính</h3>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-500'>
                Tổng tiền đặt cược
              </p>
              <h4 className='text-2xl font-bold mt-1 text-gray-900'>
                {summary.totalBets.toLocaleString()} VND
              </h4>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-500'>
                Tổng tiền thưởng
              </p>
              <h4 className='text-2xl font-bold mt-1 text-gray-900'>
                {summary.totalPayouts.toLocaleString()} VND
              </h4>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-500'>Lợi nhuận</p>
              <h4 className='text-2xl font-bold mt-1 text-green-600'>
                {summary.profit.toLocaleString()} VND
              </h4>
              <p className='text-sm text-gray-500 mt-1'>
                Tỷ lệ:{' '}
                {summary.totalBets > 0
                  ? ((summary.profit / summary.totalBets) * 100).toFixed(2)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Thống kê trò chơi */}
      <Card className='bg-white'>
        <div className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Thống kê trò chơi</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Lượt chơi đang diễn ra
                  </p>
                  <h4 className='text-2xl font-bold mt-1'>
                    {summary.activeGames}
                  </h4>
                </div>
                <Badge variant='success' dotIndicator pulsing>
                  Đang diễn ra
                </Badge>
              </div>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Lượt chơi đã hoàn thành
                  </p>
                  <h4 className='text-2xl font-bold mt-1'>
                    {summary.completedGames}
                  </h4>
                </div>
                <Badge variant='primary'>Đã hoàn thành</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex items-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-indigo-600 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='text-lg font-medium'>Tạo lượt chơi mới</h3>
            </div>
            <p className='text-gray-500 mb-4'>
              Tạo một lượt chơi mới để người dùng có thể tham gia đặt cược.
            </p>
            <Link href='/admin/games/new'>
              <Button variant='primary' className='w-full'>
                Tạo lượt chơi
              </Button>
            </Link>
          </div>
        </Card>

        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex items-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-indigo-600 mr-2'
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
              <h3 className='text-lg font-medium'>Xử lý thanh toán</h3>
            </div>
            <p className='text-gray-500 mb-4'>
              Kiểm tra và xử lý các yêu cầu thanh toán đang chờ.
            </p>
            <Link href='/admin/payment-requests'>
              <Button variant='primary' className='w-full'>
                Xem yêu cầu
              </Button>
            </Link>
          </div>
        </Card>

        <Card className='bg-white'>
          <div className='p-6'>
            <div className='flex items-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-indigo-600 mr-2'
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
              <h3 className='text-lg font-medium'>Quản lý người dùng</h3>
            </div>
            <p className='text-gray-500 mb-4'>
              Xem và quản lý thông tin của tất cả người dùng.
            </p>
            <Link href='/admin/users'>
              <Button variant='primary' className='w-full'>
                Xem danh sách
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

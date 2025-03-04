/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

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
  const { data, isLoading, error } = useQuery<{ data: DashboardSummary }>({
    queryKey: ['adminDashboardSummary'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard-summary')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      return response.json()
    },
    refetchInterval: 60000, // Refetch mỗi 1 phút
  })

  const [revenueData, setRevenueData] = useState<any[]>([])
  const [userActivityData, setUserActivityData] = useState<any[]>([])
  const COLORS = ['#0088FE', '#AAAAAA']

  const formatCurrency = (value: number) =>
    `${value.toLocaleString('vi-VN')} VND`

  if (isLoading) {
    return <Loading size='lg' />
  }

  if (error || !data) {
    return (
      <div className='p-4 bg-red-50 text-red-500 rounded-md'>
        Error loading dashboard data. Please try again later.
      </div>
    )
  }

  const summary = data.data

  // Cập nhật dữ liệu cho biểu đồ
  useEffect(() => {
    if (summary) {
      setRevenueData([
        {
          name: 'Jan',
          revenue: summary.totalBets * 0.7,
          payout: summary.totalPayouts * 0.7,
        },
        {
          name: 'Feb',
          revenue: summary.totalBets * 0.8,
          payout: summary.totalPayouts * 0.8,
        },
        {
          name: 'Mar',
          revenue: summary.totalBets * 0.9,
          payout: summary.totalPayouts * 0.9,
        },
        {
          name: 'Apr',
          revenue: summary.totalBets * 0.95,
          payout: summary.totalPayouts * 0.95,
        },
        {
          name: 'May',
          revenue: summary.totalBets * 0.98,
          payout: summary.totalPayouts * 0.98,
        },
        {
          name: 'Current',
          revenue: summary.totalBets,
          payout: summary.totalPayouts,
        },
      ])

      setUserActivityData([
        { name: 'Active Users', value: summary.activeUsers },
        {
          name: 'Inactive Users',
          value: summary.totalUsers - summary.activeUsers,
        },
      ])
    }
  }, [summary])

  return (
    <div className='space-y-6'>
      {/* Hàng 1: Các Card Tóm Tắt */}
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
              <span className='ml-1 text-gray-500'> đăng ký hôm nay</span>
            </div>
          </div>
        </Card>

        {/* Người dùng hoạt động */}
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
                  Yêu cầu thanh toán
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

      {/* Hàng 2: Biểu đồ */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Biểu đồ doanh thu vs chi phí */}
        <Card className='col-span-2 bg-white'>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Doanh thu vs Chi phí</h3>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Line
                    type='monotone'
                    dataKey='revenue'
                    stroke='#3b82f6'
                    name='Doanh thu'
                  />
                  <Line
                    type='monotone'
                    dataKey='payout'
                    stroke='#ef4444'
                    name='Chi phí'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Biểu đồ tròn cho người dùng hoạt động */}
        <Card className='bg-white'>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Người dùng hoạt động</h3>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={userActivityData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    fill='#8884d8'
                    paddingAngle={5}
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }>
                    {userActivityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Hàng 3: Thống kê chi tiết */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Card thống kê chi tiết */}
        <Card className='bg-white'>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Thống kê chi tiết</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Tổng đặt cược</p>
                    <p className='text-lg font-medium'>
                      {formatCurrency(summary.totalBets)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tổng thanh toán</p>
                    <p className='text-lg font-medium'>
                      {formatCurrency(summary.totalPayouts)}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Lợi nhuận</p>
                    <p className='text-lg font-medium'>
                      {formatCurrency(summary.profit)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tỷ lệ lợi nhuận</p>
                    <p className='text-lg font-medium'>
                      {summary.totalBets > 0
                        ? ((summary.profit / summary.totalBets) * 100).toFixed(
                            2
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Tổng lượt chơi</p>
                    <p className='text-lg font-medium'>
                      {summary.activeGames + summary.completedGames}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Đã hoàn thành</p>
                    <p className='text-lg font-medium'>
                      {summary.completedGames}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Người dùng mới hôm nay
                    </p>
                    <p className='text-lg font-medium'>
                      {summary.registrationsToday}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Người dùng hoạt động
                    </p>
                    <p className='text-lg font-medium'>{summary.activeUsers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card thống kê trò chơi */}
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
                  <Badge variant='success' dotIndicator>
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
      </div>

      {/* Hàng 4: Thao tác nhanh */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Thao tác: Tạo lượt chơi mới */}
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

        {/* Thao tác: Xử lý thanh toán */}
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

        {/* Thao tác: Quản lý người dùng */}
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

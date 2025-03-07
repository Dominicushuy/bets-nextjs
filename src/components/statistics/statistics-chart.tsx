// src/components/statistics/statistics-chart.tsx
'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useUserStatistics, useUserActivities } from '@/hooks/statistics-hooks'
import { Loading } from '@/components/ui/loading'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface StatisticsChartProps {
  userId: string
  period?: 'week' | 'month' | 'all'
}

export default function StatisticsChart({
  userId,
  period = 'all',
}: StatisticsChartProps) {
  const { data: statsData, isLoading: statsLoading } = useUserStatistics(
    userId,
    period
  )
  const { data: activitiesData, isLoading: activitiesLoading } =
    useUserActivities(
      userId,
      period === 'week' ? 7 : period === 'month' ? 30 : 90
    )

  const isLoading = statsLoading || activitiesLoading

  // Prepare win/loss data for pie chart
  const winLossData = useMemo(() => {
    if (!statsData) return []

    const wins = statsData.allTime.gamesWon
    const losses = statsData.allTime.gamesPlayed - wins

    return [
      { name: 'Thắng', value: wins, color: '#10b981' },
      { name: 'Thua', value: losses, color: '#ef4444' },
    ]
  }, [statsData])

  // Prepare daily activity data
  const dailyActivityData = useMemo(() => {
    if (!activitiesData?.statistics?.dailyActivity) return []
    return activitiesData.statistics.dailyActivity.map((day: any) => ({
      ...day,
      date: new Date(day.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
    }))
  }, [activitiesData])

  if (isLoading) {
    return <Loading />
  }

  if (!statsData || !activitiesData) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-gray-500'>
            Không có dữ liệu thống kê
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Win/Loss Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Tỷ lệ thắng/thua</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }>
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} lượt`, 'Số lượt']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Hoạt động theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={dailyActivityData.slice(-10)}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'amount')
                        return [formatCurrency(Number(value)), 'Số tiền']
                      return [value, name === 'wins' ? 'Thắng' : 'Lượt đặt']
                    }}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='bets'
                    name='Lượt đặt'
                    stroke='#3b82f6'
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='wins'
                    name='Thắng'
                    stroke='#10b981'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Win Rate Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Tỷ lệ thắng theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={dailyActivityData.slice(-7)}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ thắng']} />
                <Bar dataKey='winRate' name='Tỷ lệ thắng' fill='#8884d8'>
                  {dailyActivityData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.winRate > 50 ? '#10b981' : '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

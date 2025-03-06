// src/components/dashboard/statistics-widget.tsx
'use client'

import { Card } from '@/components/ui/card'
import { useUserStatistics } from '@/hooks/profile-hooks'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Award, Target, Zap } from 'lucide-react'

interface StatisticsWidgetProps {
  userId: string
}

export default function StatisticsWidget({ userId }: StatisticsWidgetProps) {
  const { data: statistics, isLoading } = useUserStatistics(userId)

  if (isLoading) {
    return (
      <Card>
        <div className='p-6 animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='space-y-2'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='flex justify-between items-center'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/6'></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  // Tính tỷ lệ thắng thua
  const winRate = statistics?.win_rate || 0
  const totalGames = statistics?.total_games_played || 0
  const gamesWon = statistics?.games_won || 0
  const gamesPending = totalGames - gamesWon

  return (
    <Card>
      <div className='p-6'>
        <h3 className='text-lg font-medium mb-4 flex items-center'>
          <TrendingUp className='mr-2 h-5 w-5 text-primary-500' />
          Thống kê hoạt động
        </h3>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-green-50 p-3 rounded-lg'>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-gray-600 flex items-center'>
                  <Award className='h-4 w-4 mr-1 text-green-500' />
                  Tỷ lệ thắng
                </span>
                <span className='font-medium text-green-600'>
                  {winRate.toFixed(1)}%
                </span>
              </div>
              <div className='w-full bg-gray-200 h-1.5 rounded-full overflow-hidden'>
                <div
                  className='bg-green-500 h-full rounded-full'
                  style={{ width: `${winRate}%` }}></div>
              </div>
            </div>

            <div className='bg-blue-50 p-3 rounded-lg'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 flex items-center'>
                  <Target className='h-4 w-4 mr-1 text-blue-500' />
                  Thắng lớn nhất
                </span>
                <span className='font-medium text-blue-600'>
                  {formatCurrency(statistics?.biggest_win || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center p-2 hover:bg-gray-50 rounded'>
              <span className='text-sm text-gray-600'>Tổng lượt chơi</span>
              <span className='font-medium'>
                {statistics?.total_games_played || 0}
              </span>
            </div>

            <div className='flex justify-between items-center p-2 hover:bg-gray-50 rounded'>
              <span className='text-sm text-gray-600'>Lượt thắng</span>
              <span className='font-medium text-green-600'>
                {statistics?.games_won || 0}
              </span>
            </div>

            <div className='flex justify-between items-center p-2 hover:bg-gray-50 rounded'>
              <span className='text-sm text-gray-600'>
                Tổng thưởng nhận được
              </span>
              <span className='font-medium text-primary-600'>
                {formatCurrency(statistics?.total_rewards || 0)}
              </span>
            </div>

            {statistics?.lucky_number && (
              <div className='flex justify-between items-center p-2 hover:bg-gray-50 rounded'>
                <span className='text-sm text-gray-600 flex items-center'>
                  <Zap className='h-4 w-4 mr-1 text-yellow-500' />
                  Số may mắn
                </span>
                <span className='font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded'>
                  {statistics.lucky_number}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

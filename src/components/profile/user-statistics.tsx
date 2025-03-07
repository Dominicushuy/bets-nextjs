// src/components/profile/user-statistics.tsx
'use client'

import { useState } from 'react'
import { useProfileStats } from '@/hooks/profile-hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  BarChart,
  Target,
  Percent,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UserStatisticsProps {
  userId: string
  className?: string
}

export default function UserStatistics({
  userId,
  className = '',
}: UserStatisticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')
  const { data: stats, isLoading, error } = useProfileStats(userId, period)

  if (isLoading) {
    return (
      <Card className={`p-6 space-y-5 animate-pulse ${className}`}>
        <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
        <div className='space-y-3'>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='flex justify-between'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/6'></div>
              </div>
            ))}
        </div>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='text-center text-red-500'>
          <p>Không thể tải thống kê người dùng</p>
          <p className='text-sm mt-2'>{(error as any)?.message}</p>
        </div>
      </Card>
    )
  }

  const { allTime, recent } = stats

  return (
    <Card className={`p-6 space-y-5 ${className}`}>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold flex items-center'>
          <TrendingUp className='mr-2 h-5 w-5 text-primary-500' />
          Thống kê hoạt động
        </h3>

        <div className='flex space-x-2'>
          <Badge
            variant={period === 'week' ? 'primary' : 'outline'}
            className='cursor-pointer'
            onClick={() => setPeriod('week')}>
            Tuần
          </Badge>
          <Badge
            variant={period === 'month' ? 'primary' : 'outline'}
            className='cursor-pointer'
            onClick={() => setPeriod('month')}>
            Tháng
          </Badge>
          <Badge
            variant={period === 'all' ? 'primary' : 'outline'}
            className='cursor-pointer'
            onClick={() => setPeriod('all')}>
            Tất cả
          </Badge>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <Calendar className='text-gray-500 h-4 w-4 mr-2' />
            <span className='text-gray-600'>Tổng lượt chơi</span>
          </div>
          <span className='font-medium'>
            {period === 'all' ? allTime.gamesPlayed : recent.gamesPlayed}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <Trophy className='text-gray-500 h-4 w-4 mr-2' />
            <span className='text-gray-600'>Lượt thắng</span>
          </div>
          <span className='font-medium'>
            {period === 'all' ? allTime.gamesWon : recent.gamesWon}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <Percent className='text-gray-500 h-4 w-4 mr-2' />
            <span className='text-gray-600'>Tỷ lệ thắng</span>
          </div>
          <span className='font-medium'>
            {period === 'all'
              ? `${allTime.winRate.toFixed(1)}%`
              : `${recent.winRate.toFixed(1)}%`}
          </span>
        </div>

        {period === 'all' && (
          <>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <BarChart className='text-gray-500 h-4 w-4 mr-2' />
                <span className='text-gray-600'>Thắng lớn nhất</span>
              </div>
              <span className='font-medium text-green-600'>
                {formatCurrency(allTime.biggestWin || 0)}
              </span>
            </div>

            {allTime.luckyNumber && (
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Target className='text-gray-500 h-4 w-4 mr-2' />
                  <span className='text-gray-600'>Số may mắn</span>
                </div>
                <Badge variant='warning' size='sm'>
                  {allTime.luckyNumber}
                </Badge>
              </div>
            )}
          </>
        )}
      </div>

      <div className='pt-3'>
        <Link href='/history'>
          <Button variant='outline' size='sm' fullWidth>
            <span>Xem lịch sử cá cược</span>
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

// src/components/user/user-stats-cards.tsx
'use client'

import { useUserStatistics } from '@/hooks/statistics-hooks'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  Award,
  ChevronRight,
  DollarSign,
  Target,
  Trophy,
  Percent,
  BarChart,
} from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UserStatsCardsProps {
  userId: string
  className?: string
}

export default function UserStatsCards({
  userId,
  className = '',
}: UserStatsCardsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')
  const { data: stats, isLoading } = useUserStatistics(userId, period)

  if (isLoading) {
    return <Loading />
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className='p-6'>
          <p className='text-gray-500'>Không có dữ liệu thống kê</p>
        </CardContent>
      </Card>
    )
  }

  const { allTime, recent } = stats

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex space-x-2 mb-4'>
        <Badge
          variant={period === 'week' ? 'primary' : 'outline'}
          className='cursor-pointer'
          onClick={() => setPeriod('week')}>
          Tuần này
        </Badge>
        <Badge
          variant={period === 'month' ? 'primary' : 'outline'}
          className='cursor-pointer'
          onClick={() => setPeriod('month')}>
          Tháng này
        </Badge>
        <Badge
          variant={period === 'all' ? 'primary' : 'outline'}
          className='cursor-pointer'
          onClick={() => setPeriod('all')}>
          Tất cả
        </Badge>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Tổng lượt chơi */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='p-2 rounded-full bg-blue-100'>
                  <Target className='h-5 w-5 text-blue-600' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-500'>Tổng lượt chơi</p>
                  <p className='text-2xl font-bold'>
                    {period === 'all'
                      ? allTime.gamesPlayed
                      : recent.gamesPlayed}
                  </p>
                </div>
              </div>
              {period !== 'all' && (
                <Badge variant='outline'>
                  {period === 'week' ? '7' : '30'} ngày
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lượt thắng */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='p-2 rounded-full bg-green-100'>
                  <Trophy className='h-5 w-5 text-green-600' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-500'>Lượt thắng</p>
                  <p className='text-2xl font-bold'>
                    {period === 'all' ? allTime.gamesWon : recent.gamesWon}
                  </p>
                </div>
              </div>
              <Badge variant={period === 'all' ? 'outline' : 'success'}>
                {period === 'all'
                  ? allTime.gamesPlayed > 0
                    ? `${Math.round(
                        (allTime.gamesWon / allTime.gamesPlayed) * 100
                      )}%`
                    : '0%'
                  : recent.gamesPlayed > 0
                  ? `${Math.round(
                      (recent.gamesWon / recent.gamesPlayed) * 100
                    )}%`
                  : '0%'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tỷ lệ thắng */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='p-2 rounded-full bg-indigo-100'>
                  <Percent className='h-5 w-5 text-indigo-600' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-500'>Tỷ lệ thắng</p>
                  <p className='text-2xl font-bold'>
                    {period === 'all'
                      ? `${allTime.winRate.toFixed(1)}%`
                      : `${recent.winRate.toFixed(1)}%`}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  (period === 'all' ? allTime.winRate : recent.winRate) > 50
                    ? 'success'
                    : (period === 'all' ? allTime.winRate : recent.winRate) > 30
                    ? 'warning'
                    : 'outline'
                }>
                {(period === 'all' ? allTime.winRate : recent.winRate) > 50
                  ? 'Cao'
                  : (period === 'all' ? allTime.winRate : recent.winRate) > 30
                  ? 'Trung bình'
                  : 'Thấp'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Số tiền lớn nhất */}
        {period === 'all' && (
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <BarChart className='h-5 w-5 text-orange-600' />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-gray-500'>Thắng lớn nhất</p>
                    <p className='text-2xl font-bold text-green-600'>
                      {formatCurrency(allTime.biggestWin || 0)}
                    </p>
                  </div>
                </div>
                {allTime.luckyNumber && (
                  <Badge variant='warning'>Số {allTime.luckyNumber}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tổng phần thưởng */}
        {period === 'all' && allTime.totalRewards > 0 && (
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 rounded-full bg-purple-100'>
                    <DollarSign className='h-5 w-5 text-purple-600' />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-gray-500'>Tổng phần thưởng</p>
                    <p className='text-2xl font-bold text-purple-600'>
                      {formatCurrency(allTime.totalRewards)}
                    </p>
                  </div>
                </div>
                <Link href='/rewards'>
                  <Button variant='outline' size='sm'>
                    <Award className='h-4 w-4 mr-1' /> Xem
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Xem thống kê chi tiết button */}
        <Card className='md:col-span-2'>
          <CardContent className='p-4'>
            <Link href='/statistics'>
              <Button variant='primary' fullWidth>
                <BarChart className='h-4 w-4 mr-2' />
                Xem thống kê chi tiết
                <ChevronRight className='h-4 w-4 ml-2' />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

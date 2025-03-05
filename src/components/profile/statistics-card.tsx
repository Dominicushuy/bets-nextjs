// src/components/profile/statistics-card.tsx
'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExtendedProfile, UserStatistics } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Award, History } from 'lucide-react'

interface StatisticsCardProps {
  statistics: UserStatistics | null
  profile: ExtendedProfile | null
}

export default function StatisticsCard({
  statistics,
  profile,
}: StatisticsCardProps) {
  // Tính tỷ lệ thắng nếu chưa có
  const winRate = useMemo(() => {
    if (!statistics) return 0
    if (statistics.win_rate) return statistics.win_rate
    if (statistics.total_games_played && statistics.games_won) {
      return (statistics.games_won / statistics.total_games_played) * 100
    }
    return 0
  }, [statistics])

  // Tính tiến trình cấp độ
  const levelProgress = useMemo(() => {
    // Thông thường sẽ có logic phức tạp hơn để tính toán dựa trên experience_points và level
    return Math.min(Math.floor((profile?.experience_points || 0) % 100), 100)
  }, [profile])

  return (
    <Card>
      <div className='p-6 space-y-5'>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>Thông tin tài khoản</h3>

          <div className='flex justify-between items-center py-2'>
            <span className='text-gray-600'>Cấp độ</span>
            <div className='flex flex-col items-end'>
              <div className='flex items-center space-x-1'>
                <Badge variant='primary'>Level {profile?.level || 1}</Badge>
                <Award className='h-4 w-4 text-primary-500' />
              </div>
              <div className='mt-1 w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-primary-500 rounded-full'
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center py-2'>
            <span className='text-gray-600'>Số dư</span>
            <span className='font-semibold text-green-600'>
              {formatCurrency(profile?.balance || 0)}
            </span>
          </div>

          <div className='pt-2'>
            <Link href='/payment-request'>
              <Button variant='outline' fullWidth>
                Nạp tiền
              </Button>
            </Link>
          </div>
        </div>

        <div className='pt-4 border-t border-gray-200 space-y-2'>
          <h3 className='text-lg font-semibold flex items-center'>
            <TrendingUp className='mr-2 h-5 w-5 text-primary-500' />
            Thống kê hoạt động
          </h3>

          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Tổng lượt chơi</span>
              <span className='font-medium'>
                {statistics?.total_games_played || 0}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Lượt thắng</span>
              <span className='font-medium'>{statistics?.games_won || 0}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Tỷ lệ thắng</span>
              <span className='font-medium'>{winRate.toFixed(1)}%</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Thắng lớn nhất</span>
              <span className='font-medium text-green-600'>
                {formatCurrency(statistics?.biggest_win || 0)}
              </span>
            </div>

            {statistics?.lucky_number && (
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Số may mắn</span>
                <Badge variant='warning' size='sm'>
                  {statistics.lucky_number}
                </Badge>
              </div>
            )}
          </div>

          <div className='pt-3'>
            <Link href='/history'>
              <Button variant='outline' size='sm' fullWidth>
                <History className='mr-2 h-4 w-4' />
                Xem lịch sử cá cược
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

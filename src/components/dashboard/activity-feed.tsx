// src/components/dashboard/activity-feed.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameRoundsRealtime } from '@/hooks/game-hooks'
import { formatCurrency } from '@/lib/utils'
import { ArrowUpRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ActivityFeed() {
  const { data: activeGamesData, isLoading } = useGameRoundsRealtime(
    'active',
    1,
    3
  )
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Simulate recent activity
    // In a real app, this would come from an API
    const activities = [
      {
        id: 1,
        type: 'bet',
        description: 'Đặt cược số 88',
        amount: 50000,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        gameId: activeGamesData?.data?.[0]?.id || '',
      },
      {
        id: 2,
        type: 'win',
        description: 'Thắng cược số 68',
        amount: 240000,
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
        gameId: '',
      },
      {
        id: 3,
        type: 'payment',
        description: 'Nạp tiền vào tài khoản',
        amount: 500000,
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
        gameId: '',
      },
    ]
    setRecentActivity(activities)
  }, [activeGamesData])

  if (isLoading) {
    return (
      <Card>
        <div className='p-6 animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <div className='h-10 w-10 bg-gray-200 rounded-full'></div>
                <div className='flex-1'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className='p-6'>
        <h3 className='text-lg font-medium mb-4 flex items-center'>
          <Clock className='mr-2 h-5 w-5 text-primary-500' />
          Hoạt động gần đây
        </h3>

        <div className='space-y-4'>
          {recentActivity.length === 0 ? (
            <div className='text-center py-6 text-gray-500'>
              <p>Chưa có hoạt động nào gần đây</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className='border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors'>
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='flex items-center'>
                      {activity.type === 'bet' && (
                        <Badge variant='secondary' className='mr-2'>
                          Đặt cược
                        </Badge>
                      )}
                      {activity.type === 'win' && (
                        <Badge variant='success' className='mr-2'>
                          Thắng cược
                        </Badge>
                      )}
                      {activity.type === 'payment' && (
                        <Badge variant='info' className='mr-2'>
                          Thanh toán
                        </Badge>
                      )}
                      <span className='font-medium'>
                        {activity.description}
                      </span>
                    </div>
                    <div className='text-sm text-gray-500 mt-1'>
                      {new Date(activity.timestamp).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div
                      className={`font-medium ${
                        activity.type === 'win'
                          ? 'text-green-600'
                          : activity.type === 'bet'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}>
                      {activity.type === 'bet' ? '-' : '+'}
                      {formatCurrency(activity.amount)}
                    </div>
                    {activity.gameId && (
                      <Link
                        href={`/games/${activity.gameId}`}
                        className='text-xs text-primary-600 flex items-center justify-end mt-1 hover:underline'>
                        Xem chi tiết
                        <ArrowUpRight className='ml-1 h-3 w-3' />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='mt-4 text-center'>
          <Link
            href='/history'
            className='text-sm text-primary-600 hover:text-primary-800 flex items-center justify-center'>
            Xem tất cả hoạt động
            <ArrowUpRight className='ml-1 h-4 w-4' />
          </Link>
        </div>
      </div>
    </Card>
  )
}

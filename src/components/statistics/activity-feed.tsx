// src/components/statistics/activity-feed.tsx
'use client'

import { useCallback, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  DollarSign,
  Award,
  Target,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'bet' | 'reward' | 'payment'
  amount: number
  details: any
  timestamp: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export default function ActivityFeed({
  activities,
  className,
}: ActivityFeedProps) {
  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'bet':
        return <Target className='h-5 w-5 text-primary-500' />
      case 'reward':
        return <Award className='h-5 w-5 text-yellow-500' />
      case 'payment':
        return <DollarSign className='h-5 w-5 text-green-500' />
      default:
        return <Clock className='h-5 w-5 text-gray-500' />
    }
  }, [])

  const getActivityTitle = useCallback((activity: ActivityItem) => {
    switch (activity.type) {
      case 'bet':
        return activity.details.isWinner ? 'Thắng cược' : 'Đặt cược'
      case 'reward':
        return activity.details.isUsed ? 'Đã đổi thưởng' : 'Nhận thưởng'
      case 'payment':
        return activity.details.status === 'approved'
          ? 'Nạp tiền thành công'
          : activity.details.status === 'rejected'
          ? 'Yêu cầu thanh toán bị từ chối'
          : 'Yêu cầu thanh toán'
      default:
        return 'Hoạt động'
    }
  }, [])

  const getActivityDescription = useCallback((activity: ActivityItem) => {
    switch (activity.type) {
      case 'bet':
        return activity.details.isWinner
          ? `Số ${activity.details.selectedNumber} đã thắng (Kết quả: ${activity.details.winningNumber})`
          : `Đặt số ${activity.details.selectedNumber}${
              activity.details.winningNumber
                ? ` - Kết quả: ${activity.details.winningNumber}`
                : ''
            }`
      case 'reward':
        return activity.details.isUsed
          ? `Đã sử dụng mã thưởng ${activity.details.code}`
          : `Nhận mã thưởng ${activity.details.code}`
      case 'payment':
        return activity.details.status === 'approved'
          ? 'Yêu cầu nạp tiền đã được phê duyệt'
          : activity.details.status === 'rejected'
          ? 'Yêu cầu thanh toán không được chấp nhận'
          : 'Đang chờ xác nhận'
      default:
        return ''
    }
  }, [])

  const getActivityBadge = useCallback((activity: ActivityItem) => {
    switch (activity.type) {
      case 'bet':
        if (activity.details.isWinner) {
          return <Badge variant='success'>Thắng</Badge>
        } else {
          return <Badge variant='destructive'>Thua</Badge>
        }
      case 'reward':
        if (activity.details.isUsed) {
          return <Badge variant='warning'>Đã sử dụng</Badge>
        } else {
          return <Badge variant='info'>Mới</Badge>
        }
      case 'payment':
        if (activity.details.status === 'approved') {
          return <Badge variant='success'>Đã duyệt</Badge>
        } else if (activity.details.status === 'rejected') {
          return <Badge variant='destructive'>Từ chối</Badge>
        } else {
          return <Badge variant='warning'>Đang xử lý</Badge>
        }
      default:
        return null
    }
  }, [])

  const getActivityAmount = useCallback((activity: ActivityItem) => {
    const isIncrease =
      activity.type === 'reward' ||
      (activity.type === 'payment' && activity.details.status === 'approved') ||
      (activity.type === 'bet' && activity.details.isWinner)

    return (
      <div className='flex items-center'>
        {isIncrease ? (
          <TrendingUp className='h-3 w-3 mr-1 text-green-500' />
        ) : (
          <TrendingDown className='h-3 w-3 mr-1 text-red-500' />
        )}
        <span className={isIncrease ? 'text-green-600' : 'text-red-600'}>
          {isIncrease ? '+' : '-'}
          {formatCurrency(activity.amount)}
        </span>
      </div>
    )
  }, [])

  const sortedActivities = useMemo(() => {
    return [...activities].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [activities])

  if (!activities || activities.length === 0) {
    return (
      <Card className={className}>
        <CardContent className='p-6'>
          <div className='text-center py-6 text-gray-500'>
            <p>Chưa có hoạt động nào gần đây</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg'>Lịch sử hoạt động</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {sortedActivities.map((activity) => (
            <div
              key={activity.id}
              className='p-3 border rounded-lg hover:bg-gray-50 transition-colors'>
              <div className='flex items-start'>
                <div className='flex-shrink-0 mt-1'>
                  {getActivityIcon(activity.type)}
                </div>

                <div className='ml-3 flex-grow'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <h4 className='text-sm font-medium'>
                        {getActivityTitle(activity)}
                      </h4>
                      {getActivityBadge(activity)}
                    </div>
                    {getActivityAmount(activity)}
                  </div>

                  <p className='text-sm text-gray-600 mt-1'>
                    {getActivityDescription(activity)}
                  </p>

                  <div className='flex justify-between mt-2'>
                    <span className='text-xs text-gray-500'>
                      {formatDateTime(activity.timestamp)}
                    </span>

                    {activity.type === 'bet' && (
                      <Link
                        href={`/games/${activity.id}`}
                        className='text-xs text-primary-600 hover:underline flex items-center'>
                        Chi tiết
                        <ArrowUpRight className='ml-1 h-3 w-3' />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

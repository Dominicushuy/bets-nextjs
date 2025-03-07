// src/components/user/UserStatsCards.tsx
import React from 'react'
import { Card } from '@/components/ui/card'
import { useUserStatistics } from '@/hooks/statistics-hooks'
import { formatCurrency } from '@/lib/utils'
import {
  Trophy,
  Target,
  LineChart,
  Percent,
  DollarSign,
  Calendar,
} from 'lucide-react'

interface UserStatsCardsProps {
  userId: string
  className?: string
}

export default function UserStatsCards({
  userId,
  className,
}: UserStatsCardsProps) {
  const { data, isLoading, error } = useUserStatistics(userId)

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='p-4 animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-1/3 mb-2'></div>
            <div className='h-6 bg-gray-200 rounded w-2/3 mb-1'></div>
            <div className='h-3 bg-gray-200 rounded w-1/2'></div>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className='text-center text-red-500'>
          <p>Không thể tải thống kê người dùng</p>
        </div>
      </Card>
    )
  }

  const stats = data.allTime

  const statCards = [
    {
      title: 'Tỷ lệ thắng',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: <Percent className='h-4 w-4 text-blue-500' />,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Thắng lớn nhất',
      value: formatCurrency(stats.biggestWin),
      icon: <Trophy className='h-4 w-4 text-green-500' />,
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Tổng lượt chơi',
      value: stats.gamesPlayed.toString(),
      icon: <Calendar className='h-4 w-4 text-purple-500' />,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Lượt thắng',
      value: stats.gamesWon.toString(),
      icon: <Target className='h-4 w-4 text-yellow-500' />,
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Tổng thưởng đã nhận',
      value: formatCurrency(stats.totalRewards),
      icon: <DollarSign className='h-4 w-4 text-red-500' />,
      color: 'bg-red-50 text-red-700',
    },
    {
      title: 'Xu hướng gần đây',
      value: data.recent.winRate > stats.winRate ? 'Tăng' : 'Giảm',
      icon: <LineChart className='h-4 w-4 text-indigo-500' />,
      color: 'bg-indigo-50 text-indigo-700',
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {statCards.map((card, index) => (
        <Card key={index} className={`p-4 ${card.color}`}>
          <div className='flex items-center mb-1'>
            {card.icon}
            <span className='text-sm font-medium ml-1'>{card.title}</span>
          </div>
          <div className='text-xl font-bold'>{card.value}</div>
          {index === 5 && (
            <div className='text-xs'>
              {data.recent.winRate > stats.winRate
                ? `+${(data.recent.winRate - stats.winRate).toFixed(
                    1
                  )}% so với TB`
                : `${(data.recent.winRate - stats.winRate).toFixed(
                    1
                  )}% so với TB`}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

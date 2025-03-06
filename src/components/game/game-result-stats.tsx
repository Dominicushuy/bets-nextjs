// src/components/game/game-result-stats.tsx
'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { GameRound } from '@/types/database'
import {
  Users,
  Award,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart2,
} from 'lucide-react'

interface GameResultStatsProps {
  gameData: GameRound
  stats: {
    totalPlayers: number
    totalWinners: number
    totalBets: number
    totalPayout: number
  }
  isWinner: boolean
}

export default function GameResultStats({
  gameData,
  stats,
  isWinner,
}: GameResultStatsProps) {
  // Tính toán tỷ lệ người thắng
  const winRate = useMemo(() => {
    if (!stats.totalPlayers) return 0
    return ((stats.totalWinners / stats.totalPlayers) * 100).toFixed(1)
  }, [stats.totalPlayers, stats.totalWinners])

  // Tính lợi nhuận
  const profit = useMemo(() => {
    return stats.totalBets - stats.totalPayout
  }, [stats.totalBets, stats.totalPayout])

  return (
    <Card className='overflow-hidden'>
      <div className='p-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <BarChart2 className='mr-2 h-5 w-5 text-primary-500' />
          Thống kê lượt chơi
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center text-gray-700'>
                <Users className='h-4 w-4 mr-2 text-primary-500' />
                <span>Tổng người chơi:</span>
              </div>
              <span className='font-medium'>{stats.totalPlayers}</span>
            </div>

            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center text-gray-700'>
                <Award className='h-4 w-4 mr-2 text-green-500' />
                <span>Người thắng:</span>
              </div>
              <span className='font-medium text-green-600'>
                {stats.totalWinners}
              </span>
            </div>

            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center text-gray-700'>
                <TrendingUp className='h-4 w-4 mr-2 text-blue-500' />
                <span>Tỷ lệ thắng:</span>
              </div>
              <Badge variant='primary'>{winRate}%</Badge>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center text-gray-700'>
                <DollarSign className='h-4 w-4 mr-2 text-yellow-500' />
                <span>Tổng tiền cược:</span>
              </div>
              <span className='font-medium'>
                {formatCurrency(stats.totalBets)}
              </span>
            </div>

            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center text-gray-700'>
                <DollarSign className='h-4 w-4 mr-2 text-green-500' />
                <span>Tổng thưởng:</span>
              </div>
              <span className='font-medium text-green-600'>
                {formatCurrency(stats.totalPayout)}
              </span>
            </div>

            <div
              className={`flex justify-between items-center p-3 rounded-lg ${
                profit >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
              <div className='flex items-center text-gray-700'>
                <DollarSign className='h-4 w-4 mr-2 text-primary-500' />
                <span>Lợi nhuận hệ thống:</span>
              </div>
              <span
                className={`font-medium ${
                  profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {formatCurrency(profit)}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-4 p-4 rounded-lg bg-gray-50'>
          <div className='flex items-center mb-2'>
            <Clock className='h-4 w-4 mr-2 text-gray-500' />
            <span className='text-sm text-gray-600'>Thời gian kết thúc:</span>
          </div>
          <div className='font-medium'>
            {new Date(gameData.end_time || '').toLocaleString('vi-VN')}
          </div>
        </div>

        <div className='mt-4 p-4 rounded-lg bg-primary-50 flex justify-between items-center'>
          <div className='flex items-center'>
            <CheckCircle className='h-5 w-5 mr-2 text-green-500' />
            <span className='font-medium'>Trạng thái của bạn:</span>
          </div>
          {isWinner ? (
            <Badge variant='success' className='text-sm'>
              Thắng
            </Badge>
          ) : (
            <Badge variant='destructive' className='text-sm'>
              Thua
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

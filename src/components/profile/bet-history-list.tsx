// src/components/profile/bet-history-list.tsx
'use client'

import { useState } from 'react'
import { useBetHistory } from '@/hooks/profile-hooks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BetHistoryListProps {
  userId: string
  limit?: number
  showPagination?: boolean
  className?: string
}

export default function BetHistoryList({
  userId,
  limit = 5,
  showPagination = true,
  className = '',
}: BetHistoryListProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useBetHistory(userId, page, limit)

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='animate-pulse space-y-4'>
          <div className='h-5 bg-gray-200 rounded w-1/4 mb-4'></div>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='border-b pb-4 space-y-2'>
                <div className='flex justify-between'>
                  <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                </div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </div>
            ))}
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='text-center text-red-500'>
          <p>Không thể tải lịch sử đặt cược</p>
          <p className='text-sm mt-2'>{(error as any)?.message}</p>
        </div>
      </Card>
    )
  }

  const { data: bets, pagination } = data

  if (bets.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='text-center text-gray-500'>
          <p>Bạn chưa có lịch sử đặt cược nào</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className='text-lg font-semibold mb-4'>Lịch sử đặt cược gần đây</h3>

      <div className='space-y-4'>
        {bets.map((bet) => (
          <div key={bet.id} className='border-b pb-4 last:border-b-0 last:pb-0'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <span className='font-medium'>
                  Đặt số: {bet.selected_number}
                </span>
                <Badge variant={bet.is_winner ? 'success' : 'danger'}>
                  {bet.is_winner ? 'Thắng' : 'Thua'}
                </Badge>
              </div>
              <span
                className={`font-semibold ${
                  bet.is_winner ? 'text-green-600' : 'text-gray-600'
                }`}>
                {formatCurrency(bet.amount)}
              </span>
            </div>
            <div className='mt-1 flex justify-between text-sm text-gray-500'>
              <span>
                {bet.game_round?.winning_number
                  ? `Kết quả: ${bet.game_round.winning_number}`
                  : 'Chờ kết quả'}
              </span>
              <span>{formatDateTime(bet.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {showPagination && pagination.totalPages > 1 && (
        <div className='flex justify-between items-center mt-6'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}>
            <ChevronLeft className='h-4 w-4 mr-1' />
            Trước
          </Button>

          <span className='text-sm text-gray-500'>
            Trang {page} / {pagination.totalPages}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}>
            Sau
            <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        </div>
      )}
    </Card>
  )
}

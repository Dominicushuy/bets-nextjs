// src/components/game/bet-list.tsx
'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Bet } from '@/types/database'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useGameBets } from '@/hooks/game-hooks'

interface BetListProps {
  gameId: string
  filter?: 'all' | 'user' // 'all' for all bets, 'user' for user bets only
  userId?: string
  initialBets?: Bet[]
  className?: string
  title?: string
  winningNumber?: string | null
}

export default function BetList({
  gameId,
  filter = 'all',
  userId,
  initialBets,
  className = '',
  title = 'Lịch sử đặt cược',
  winningNumber = null,
}: BetListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  // Fetch all bets for this game if not provided
  const { data: fetchedBets, isLoading } = useGameBets(gameId)

  // Use provided initialBets or fetched bets
  const bets = initialBets || fetchedBets || []

  // Filter bets if needed
  const filteredBets =
    filter === 'user' && userId
      ? bets.filter((bet) => bet.user_id === userId)
      : bets

  // Paginate bets
  const paginatedBets = filteredBets.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredBets.length / pageSize)

  // Check if a bet is a winner (if winning number is provided)
  const isWinner = (bet: Bet) => {
    if (!winningNumber) return null
    return bet.selected_number === winningNumber
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <div className='p-4'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='h-12 bg-gray-100 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className='p-4'>
        <h3 className='text-lg font-medium mb-4'>{title}</h3>

        {paginatedBets.length === 0 ? (
          <div className='text-center py-6 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>Chưa có lịch sử đặt cược nào</p>
          </div>
        ) : (
          <div className='space-y-3 max-h-[400px] overflow-y-auto pr-1'>
            {paginatedBets.map((bet) => {
              const winner = isWinner(bet)

              return (
                <div
                  key={bet.id}
                  className={`p-3 border rounded-lg ${
                    winner === true
                      ? 'border-green-200 bg-green-50'
                      : winner === false
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200'
                  }`}>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='flex items-center'>
                        <span className='font-medium text-lg'>
                          {bet.selected_number}
                        </span>
                        {winner !== null && (
                          <Badge
                            variant={winner ? 'success' : 'destructive'}
                            className='ml-2'>
                            {winner ? 'Thắng' : 'Thua'}
                          </Badge>
                        )}
                      </div>
                      <div className='text-sm text-gray-500 mt-1'>
                        {formatDateTime(bet.created_at)}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium'>
                        {formatCurrency(bet.amount)}
                      </div>
                      {bet.user && filter === 'all' && (
                        <div className='text-sm text-gray-500 mt-1'>
                          {bet.user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-4 space-x-2'>
            <button
              className='px-3 py-1 rounded border border-gray-300 disabled:opacity-50'
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              &laquo;
            </button>

            <span className='px-3 py-1'>
              Trang {page}/{totalPages}
            </span>

            <button
              className='px-3 py-1 rounded border border-gray-300 disabled:opacity-50'
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              &raquo;
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

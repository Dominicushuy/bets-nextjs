// src/components/game/bet-list.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Bet } from '@/types/database'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useGameBets } from '@/hooks/game-hooks'
import Pagination from '@/components/ui/pagination'
import { Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react'

interface BetListProps {
  gameId: string
  filter?: 'all' | 'user' // 'all' for all bets, 'user' for user bets only
  userId?: string
  initialBets?: Bet[]
  className?: string
  title?: string
  winningNumber?: string | null
  showSearch?: boolean
  showFilter?: boolean
  maxHeight?: string
}

export default function BetList({
  gameId,
  filter = 'all',
  userId,
  initialBets,
  className = '',
  title = 'Lịch sử đặt cược',
  winningNumber = null,
  showSearch = true,
  showFilter = true,
  maxHeight = '400px',
}: BetListProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'win' | 'lose' | 'pending'
  >('all')
  const [sortOrder, setSortOrder] = useState<
    'newest' | 'oldest' | 'amountDesc' | 'amountAsc'
  >('newest')

  // Fetch all bets for this game if not provided
  const { data: fetchedBets, isLoading, refetch } = useGameBets(gameId)

  // Use provided initialBets or fetched bets
  const bets = initialBets || fetchedBets || []

  // Filter bets based on user filter
  const userFilteredBets = useMemo(
    () =>
      filter === 'user' && userId
        ? bets.filter((bet) => bet.user_id === userId)
        : bets,
    [bets, filter, userId]
  )

  // Apply search, status filter and sorting
  const filteredBets = useMemo(() => {
    let result = [...userFilteredBets]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (bet) =>
          bet.selected_number.includes(searchTerm) ||
          bet.user?.phone?.includes(searchTerm)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all' && winningNumber) {
      if (statusFilter === 'win') {
        result = result.filter((bet) => bet.selected_number === winningNumber)
      } else if (statusFilter === 'lose') {
        result = result.filter((bet) => bet.selected_number !== winningNumber)
      }
    } else if (statusFilter === 'pending') {
      result = result.filter((bet) => bet.is_winner === null)
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        case 'oldest':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        case 'amountDesc':
          return b.amount - a.amount
        case 'amountAsc':
          return a.amount - b.amount
        default:
          return 0
      }
    })
  }, [userFilteredBets, searchTerm, statusFilter, winningNumber, sortOrder])

  // Paginate bets
  const paginatedBets = useMemo(
    () => filteredBets.slice((page - 1) * pageSize, page * pageSize),
    [filteredBets, page, pageSize]
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredBets.length / pageSize)

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, sortOrder])

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
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            className='flex items-center'>
            <RefreshCw className='h-4 w-4 mr-1' />
            Làm mới
          </Button>
        </div>

        {(showSearch || showFilter) && (
          <div className='mb-4 flex flex-col sm:flex-row gap-2'>
            {showSearch && (
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Tìm kiếm số hoặc người chơi...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            )}

            {showFilter && (
              <div className='flex gap-2'>
                <div className='relative'>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className='pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white'>
                    <option value='all'>Tất cả trạng thái</option>
                    {winningNumber && (
                      <>
                        <option value='win'>Thắng</option>
                        <option value='lose'>Thua</option>
                      </>
                    )}
                    <option value='pending'>Chưa có kết quả</option>
                  </select>
                  <Filter className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                </div>

                <div className='relative'>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className='pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white'>
                    <option value='newest'>Mới nhất</option>
                    <option value='oldest'>Cũ nhất</option>
                    <option value='amountDesc'>Tiền cược (cao → thấp)</option>
                    <option value='amountAsc'>Tiền cược (thấp → cao)</option>
                  </select>
                  <ArrowUpDown className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                </div>
              </div>
            )}
          </div>
        )}

        {paginatedBets.length === 0 ? (
          <div className='text-center py-6 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>Chưa có lịch sử đặt cược nào</p>
          </div>
        ) : (
          <div className='space-y-3 overflow-y-auto pr-1' style={{ maxHeight }}>
            {paginatedBets.map((bet) => {
              const winner = isWinner(bet)

              return (
                <div
                  key={bet.id}
                  className={`p-3 border rounded-lg transition-all duration-150 hover:shadow-sm ${
                    winner === true
                      ? 'border-green-200 bg-green-50'
                      : winner === false
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
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
          <div className='mt-4'>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </Card>
  )
}

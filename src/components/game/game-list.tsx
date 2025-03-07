// src/components/game/game-list.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGameRoundsRealtime } from '@/hooks/game-hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import GameListSkeleton from './game-list-skeleton'

interface GamesListProps {
  userId: string
}

export default function GamesList({ userId }: GamesListProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [page, setPage] = useState(1)
  const limit = 10 // số item mỗi trang

  const { data: activeGamesData, isLoading: activeLoading } =
    useGameRoundsRealtime('active', page, limit)
  const { data: completedGamesData, isLoading: completedLoading } =
    useGameRoundsRealtime('completed', page, limit)

  const isLoading = activeLoading || completedLoading

  if (isLoading) {
    return <GameListSkeleton />
  }

  const activeGames = activeGamesData?.data || []
  const activePagination = activeGamesData?.pagination

  const completedGames = completedGamesData?.data || []
  const completedPagination = completedGamesData?.pagination

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant='warning'>Chờ bắt đầu</Badge>
      case 'active':
        return (
          <Badge variant='success' dotIndicator pulsing>
            Đang diễn ra
          </Badge>
        )
      case 'completed':
        return <Badge variant='primary'>Đã hoàn thành</Badge>
      case 'cancelled':
        return <Badge variant='destructive'>Đã hủy</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='space-y-6'>
      {/* Tab Navigation */}
      <div className='flex border-b border-gray-200'>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
          onClick={() => {
            setActiveTab('active')
            setPage(1) // Reset page when changing tabs
          }}>
          Lượt chơi đang diễn ra
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
          onClick={() => {
            setActiveTab('completed')
            setPage(1) // Reset page when changing tabs
          }}>
          Lượt chơi đã hoàn thành
        </button>
      </div>

      {/* Game Lists */}
      {activeTab === 'active' ? (
        <Card title='Lượt chơi đang diễn ra' className='p-6'>
          {activeGames.length === 0 ? (
            <div className='text-center py-6 text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                Không có lượt chơi nào
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                Hiện không có lượt chơi nào đang diễn ra.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Trạng thái
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Thời gian bắt đầu
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tổng tiền đặt cược
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {activeGames.map((game) => (
                    <tr key={game.id}>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.id.substring(0, 8)}...
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {getStatusBadge(game.status)}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(game.start_time).toLocaleString('vi-VN')}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.total_bets?.toLocaleString()} VND
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
                        <Link href={`/games/${game.id}`}>
                          <Button variant='primary' size='sm'>
                            Đặt cược
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination for active games */}
              {activePagination && activePagination.totalPages > 1 && (
                <div className='mt-4'>
                  <Pagination
                    currentPage={page}
                    totalPages={activePagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card title='Lượt chơi đã hoàn thành' className='p-6'>
          {completedGames.length === 0 ? (
            <div className='text-center py-6 text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                Không có lịch sử
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                Chưa có lượt chơi nào đã hoàn thành.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Thời gian kết thúc
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Số trúng thưởng
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tổng tiền đặt cược
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tổng tiền thưởng
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {completedGames.map((game) => (
                    <tr key={game.id}>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.id.substring(0, 8)}...
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.end_time
                          ? new Date(game.end_time).toLocaleString('vi-VN')
                          : '-'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-600'>
                        {game.winning_number || '-'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.total_bets?.toLocaleString()} VND
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {game.total_payout?.toLocaleString()} VND
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
                        <Link href={`/games/${game.id}`}>
                          <Button variant='outline' size='sm'>
                            Xem
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination for completed games */}
              {completedPagination && completedPagination.totalPages > 1 && (
                <div className='mt-4'>
                  <Pagination
                    currentPage={page}
                    totalPages={completedPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

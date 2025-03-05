'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGameRoundsRealtime } from '@/hooks/game-hooks'
import { useCompleteGameRound } from '@/hooks/game-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Loading } from '@/components/ui/loading'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import Pagination from '@/components/ui/pagination'

export default function AdminGameList() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'active' | 'pending' | 'completed' | 'all'
  >('active')
  const [page, setPage] = useState(1)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [winningNumber, setWinningNumber] = useState('')
  const [error, setError] = useState('')

  const limit = 10

  // Fetch game rounds with real-time updates
  const { data: gamesData, isLoading } = useGameRoundsRealtime(
    activeTab === 'all' ? undefined : activeTab,
    page,
    limit
  )

  // Hook for completing a game
  const { mutate: completeGame, isPending: isCompleting } =
    useCompleteGameRound()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleShowCompleteDialog = (gameId: string) => {
    setSelectedGameId(gameId)
    setWinningNumber('')
    setError('')
    setCompleteDialogOpen(true)
  }

  const handleCompleteGame = () => {
    setError('')

    if (!winningNumber) {
      setError('Vui lòng nhập số trúng thưởng')
      return
    }

    completeGame(
      { gameId: selectedGameId, winningNumber },
      {
        onSuccess: () => {
          setCompleteDialogOpen(false)
          router.refresh()
        },
        onError: (error: any) => {
          setError(error.message || 'Lỗi khi kết thúc lượt chơi')
        },
      }
    )
  }

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

  if (isLoading) {
    return <Loading />
  }

  const games = gamesData?.data || []
  const pagination = gamesData?.pagination

  return (
    <Card>
      <div className='p-6'>
        {/* Tab navigation */}
        <div className='flex border-b border-gray-200 mb-6'>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'active'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('active')
              setPage(1)
            }}>
            Đang diễn ra
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'pending'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('pending')
              setPage(1)
            }}>
            Chờ bắt đầu
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'completed'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('completed')
              setPage(1)
            }}>
            Đã hoàn thành
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('all')
              setPage(1)
            }}>
            Tất cả
          </button>
        </div>

        {games.length === 0 ? (
          <div className='text-center py-8 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>
              Không có lượt chơi nào{' '}
              {activeTab !== 'all' ? `trạng thái ${activeTab}` : ''}
            </p>
            <Link href='/admin/games/new'>
              <Button variant='primary' className='mt-4'>
                Tạo lượt chơi mới
              </Button>
            </Link>
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
                    Thời gian kết thúc
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tổng tiền cược
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Số trúng
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {game.id.substring(0, 8)}...
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm'>
                      {getStatusBadge(game.status)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatDateTime(game.start_time)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {game.end_time ? formatDateTime(game.end_time) : '-'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatCurrency(game.total_bets || 0)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {game.winning_number || '-'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin/games/${game.id}`}>
                          <Button variant='outline' size='sm'>
                            Chi tiết
                          </Button>
                        </Link>

                        {game.status === 'active' && (
                          <Button
                            variant='primary'
                            size='sm'
                            onClick={() => handleShowCompleteDialog(game.id)}>
                            Kết thúc
                          </Button>
                        )}

                        {game.status === 'pending' && (
                          <Link href={`/admin/games/${game.id}/edit`}>
                            <Button variant='secondary' size='sm'>
                              Sửa
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='mt-6'>
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog kết thúc lượt chơi */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        title='Kết thúc lượt chơi'
        description='Chọn số trúng thưởng để kết thúc lượt chơi này.'>
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Số trúng thưởng
            </label>
            <div className='flex flex-wrap gap-2 mb-3'>
              {['1', '2', '3', '7', '8', '9', '66', '68', '88', '99'].map(
                (num) => (
                  <button
                    key={num}
                    type='button'
                    onClick={() => setWinningNumber(num)}
                    className={`px-4 py-2 rounded-md ${
                      winningNumber === num
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}>
                    {num}
                  </button>
                )
              )}
            </div>
            <input
              type='text'
              value={winningNumber}
              onChange={(e) => setWinningNumber(e.target.value)}
              className='w-full px-4 py-3 text-lg text-center border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium'
              placeholder='Nhập số trúng thưởng'
            />
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <p className='text-yellow-800 text-sm'>
              <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Số trúng
              thưởng sẽ được sử dụng để xác định người thắng và phân phối phần
              thưởng.
            </p>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='secondary'
            onClick={() => setCompleteDialogOpen(false)}
            disabled={isCompleting}>
            Hủy
          </Button>
          <Button
            variant='primary'
            onClick={handleCompleteGame}
            loading={isCompleting}>
            Xác nhận kết thúc
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}

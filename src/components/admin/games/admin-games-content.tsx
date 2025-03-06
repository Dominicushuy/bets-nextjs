'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import Pagination from '@/components/ui/pagination'
import {
  useGameRounds,
  useCreateGameRound,
  useUpdateGameRound,
  useDeleteGameRound,
  useCompleteGameRound,
} from '@/hooks/game-hooks'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { PlusCircle, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'

interface AdminGamesContentProps {
  userId: string
}

export default function AdminGamesContent({ userId }: AdminGamesContentProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [newGameData, setNewGameData] = useState({
    startTime: new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16), // 30 minutes from now
    status: 'pending',
  })
  const [winningNumber, setWinningNumber] = useState('')

  // Queries
  const {
    data: gamesData,
    isLoading,
    refetch,
  } = useGameRounds(undefined, page, limit)

  // Mutations
  const { mutate: createGame, isPending: isCreating } = useCreateGameRound()
  const { mutate: updateGame, isPending: isUpdating } = useUpdateGameRound()
  const { mutate: deleteGame, isPending: isDeleting } = useDeleteGameRound()
  const { mutate: completeGame, isPending: isCompleting } =
    useCompleteGameRound()

  // Helpers
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

  // Handlers
  const handleCreateGame = () => {
    createGame(
      {
        created_by: userId,
        start_time: new Date(newGameData.startTime).toISOString(),
        status: newGameData.status as 'pending' | 'active',
      },
      {
        onSuccess: () => {
          toast.success('Tạo lượt chơi mới thành công')
          setCreateDialogOpen(false)
          refetch()
          // Reset form
          setNewGameData({
            startTime: new Date(Date.now() + 30 * 60000)
              .toISOString()
              .slice(0, 16),
            status: 'pending',
          })
        },
        onError: (error: any) => {
          toast.error(`Lỗi khi tạo lượt chơi: ${error.message}`)
        },
      }
    )
  }

  const handleEditGame = () => {
    if (!selectedGame) return

    updateGame(
      {
        gameId: selectedGame.id,
        data: {
          start_time: new Date(selectedGame.start_time).toISOString(),
          status: selectedGame.status,
        },
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật lượt chơi thành công')
          setEditDialogOpen(false)
          refetch()
        },
        onError: (error: any) => {
          toast.error(`Lỗi khi cập nhật lượt chơi: ${error.message}`)
        },
      }
    )
  }

  const handleDeleteGame = () => {
    if (!selectedGame) return

    deleteGame(selectedGame.id, {
      onSuccess: () => {
        toast.success('Xóa lượt chơi thành công')
        setDeleteDialogOpen(false)
        refetch()
      },
      onError: (error: any) => {
        toast.error(`Lỗi khi xóa lượt chơi: ${error.message}`)
      },
    })
  }

  const handleCompleteGame = () => {
    if (!selectedGame || !winningNumber) return

    completeGame(
      {
        gameId: selectedGame.id,
        winningNumber,
      },
      {
        onSuccess: () => {
          toast.success(`Lượt chơi đã kết thúc với số trúng: ${winningNumber}`)
          setCompleteDialogOpen(false)
          refetch()
          setWinningNumber('')
        },
        onError: (error: any) => {
          toast.error(`Lỗi khi kết thúc lượt chơi: ${error.message}`)
        },
      }
    )
  }

  if (isLoading) {
    return <Loading />
  }

  const games = gamesData?.data || []
  const pagination = gamesData?.pagination || {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  }

  return (
    <div className='space-y-6'>
      <Card>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>Danh sách lượt chơi</h2>
            <Button
              variant='primary'
              onClick={() => setCreateDialogOpen(true)}
              className='flex items-center'>
              <PlusCircle className='mr-2 h-4 w-4' />
              Tạo lượt chơi mới
            </Button>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Người tạo
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thời gian bắt đầu
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Số trúng
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tổng cược
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {games.map((game) => (
                  <tr key={game.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {game.id.substring(0, 8)}...
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {game.creator?.phone ||
                        game.created_by.substring(0, 8) + '...'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatDateTime(game.start_time)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {getStatusBadge(game.status)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {game.winning_number || '-'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {(game.total_bets || 0).toLocaleString()} VND
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 space-x-2'>
                      <Link href={`/admin/games/${game.id}`}>
                        <Button variant='outline' size='sm'>
                          Chi tiết
                        </Button>
                      </Link>

                      {game.status === 'pending' && (
                        <>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setSelectedGame(game)
                              setEditDialogOpen(true)
                            }}>
                            <Edit className='h-4 w-4 mr-1' />
                            Sửa
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              setSelectedGame(game)
                              setDeleteDialogOpen(true)
                            }}>
                            <Trash2 className='h-4 w-4 mr-1' />
                            Xóa
                          </Button>
                        </>
                      )}

                      {game.status === 'active' && (
                        <Button
                          variant='success'
                          size='sm'
                          onClick={() => {
                            setSelectedGame(game)
                            setCompleteDialogOpen(true)
                          }}>
                          <CheckCircle className='h-4 w-4 mr-1' />
                          Kết thúc
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                {games.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-4 py-8 text-center text-gray-500 whitespace-nowrap'>
                      Không có lượt chơi nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className='mt-6'>
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Create Game Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title='Tạo lượt chơi mới'
        description='Nhập thông tin để tạo lượt chơi mới'>
        <div className='space-y-4 my-4'>
          <div>
            <label
              htmlFor='startTime'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Thời gian bắt đầu
            </label>
            <input
              type='datetime-local'
              id='startTime'
              value={newGameData.startTime}
              onChange={(e) =>
                setNewGameData({ ...newGameData, startTime: e.target.value })
              }
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>

          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Trạng thái
            </label>
            <select
              id='status'
              value={newGameData.status}
              onChange={(e) =>
                setNewGameData({ ...newGameData, status: e.target.value })
              }
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'>
              <option value='pending'>Chờ bắt đầu</option>
              <option value='active'>Đang diễn ra</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => setCreateDialogOpen(false)}
            disabled={isCreating}>
            Hủy
          </Button>
          <Button
            variant='primary'
            onClick={handleCreateGame}
            loading={isCreating}
            disabled={isCreating}>
            Tạo lượt chơi
          </Button>
        </div>
      </Dialog>

      {/* Edit Game Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title='Chỉnh sửa lượt chơi'
        description='Cập nhật thông tin lượt chơi'>
        <div className='space-y-4 my-4'>
          <div>
            <label
              htmlFor='editStartTime'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Thời gian bắt đầu
            </label>
            <input
              type='datetime-local'
              id='editStartTime'
              value={
                selectedGame
                  ? new Date(selectedGame.start_time).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                setSelectedGame({
                  ...selectedGame,
                  start_time: new Date(e.target.value).toISOString(),
                })
              }
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>

          <div>
            <label
              htmlFor='editStatus'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Trạng thái
            </label>
            <select
              id='editStatus'
              value={selectedGame?.status || ''}
              onChange={(e) =>
                setSelectedGame({ ...selectedGame, status: e.target.value })
              }
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'>
              <option value='pending'>Chờ bắt đầu</option>
              <option value='active'>Đang diễn ra</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => setEditDialogOpen(false)}
            disabled={isUpdating}>
            Hủy
          </Button>
          <Button
            variant='primary'
            onClick={handleEditGame}
            loading={isUpdating}
            disabled={isUpdating}>
            Cập nhật
          </Button>
        </div>
      </Dialog>

      {/* Delete Game Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title='Xóa lượt chơi'
        description='Bạn có chắc chắn muốn xóa lượt chơi này? Hành động này không thể hoàn tác.'>
        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={handleDeleteGame}
            loading={isDeleting}
            disabled={isDeleting}>
            Xóa
          </Button>
        </div>
      </Dialog>

      {/* Complete Game Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        title='Kết thúc lượt chơi'
        description='Nhập số trúng thưởng để kết thúc lượt chơi và tính toán kết quả.'>
        <div className='space-y-4 my-4'>
          <div>
            <label
              htmlFor='winningNumber'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Số trúng thưởng
            </label>
            <input
              type='text'
              id='winningNumber'
              value={winningNumber}
              onChange={(e) => setWinningNumber(e.target.value)}
              placeholder='Nhập số trúng (ví dụ: 88)'
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => setCompleteDialogOpen(false)}
            disabled={isCompleting}>
            Hủy
          </Button>
          <Button
            variant='success'
            onClick={handleCompleteGame}
            loading={isCompleting}
            disabled={isCompleting || !winningNumber}>
            Hoàn thành lượt chơi
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

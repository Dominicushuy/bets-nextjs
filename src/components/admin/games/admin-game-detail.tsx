'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Loading } from '@/components/ui/loading'
import {
  useCompleteGameRound,
  useUpdateGameRound,
  useDeleteGameRound,
} from '@/hooks/game-hooks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  Download,
} from 'lucide-react'

interface AdminGameDetailProps {
  gameId: string
  userId: string
}

export default function AdminGameDetail({
  gameId,
  userId,
}: AdminGameDetailProps) {
  const router = useRouter()
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [winningNumber, setWinningNumber] = useState('')
  const [gameData, setGameData] = useState<any>(null)

  // Queries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'games', 'detail', gameId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/games/${gameId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch game details')
      }
      return response.json()
    },
  })

  // Set game data when loaded
  useEffect(() => {
    if (data?.game) {
      setGameData(data.game)
    }
  }, [data])

  // Mutations
  const { mutate: completeGame, isPending: isCompleting } =
    useCompleteGameRound()
  const { mutate: updateGame, isPending: isUpdating } = useUpdateGameRound()
  const { mutate: deleteGame, isPending: isDeleting } = useDeleteGameRound()

  // Handlers
  const handleCompleteGame = () => {
    if (!winningNumber) {
      toast.error('Vui lòng nhập số trúng thưởng')
      return
    }

    completeGame(
      {
        gameId,
        winningNumber,
      },
      {
        onSuccess: () => {
          toast.success(`Lượt chơi đã kết thúc với số trúng: ${winningNumber}`)
          setCompleteDialogOpen(false)
          refetch()
        },
        onError: (error: any) => {
          toast.error(`Lỗi khi kết thúc lượt chơi: ${error.message}`)
        },
      }
    )
  }

  const handleUpdateGame = () => {
    if (!gameData) return

    updateGame(
      {
        gameId,
        data: {
          start_time: new Date(gameData.start_time).toISOString(),
          status: gameData.status,
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
    deleteGame(gameId, {
      onSuccess: () => {
        toast.success('Xóa lượt chơi thành công')
        setDeleteDialogOpen(false)
        router.push('/admin/games')
      },
      onError: (error: any) => {
        toast.error(`Lỗi khi xóa lượt chơi: ${error.message}`)
      },
    })
  }

  const exportBetsToCSV = () => {
    if (!data || !data.bets || data.bets.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    const bets = data.bets
    let csvContent = 'data:text/csv;charset=utf-8,'

    // Headers
    const headers = [
      'ID',
      'Người đặt',
      'Số đã chọn',
      'Số tiền',
      'Thời gian',
      'Trạng thái',
    ]
    csvContent += headers.join(',') + '\n'

    // Data rows
    bets.forEach((bet: any) => {
      const row = [
        `"${bet.id}"`,
        `"${bet.user?.phone || bet.user_id}"`,
        `"${bet.selected_number}"`,
        bet.amount,
        `"${new Date(bet.created_at).toLocaleString('vi-VN')}"`,
        `"${
          bet.is_winner === true
            ? 'Thắng'
            : bet.is_winner === false
            ? 'Thua'
            : 'Chưa xác định'
        }"`,
      ]
      csvContent += row.join(',') + '\n'
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `game_bets_${gameId.substring(0, 8)}_${
        new Date().toISOString().split('T')[0]
      }.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  if (error || !data) {
    return (
      <Card>
        <div className='p-6 text-center'>
          <h2 className='text-lg font-medium text-red-600'>
            Không thể tải thông tin lượt chơi
          </h2>
          <p className='mt-2 text-gray-500'>
            Đã xảy ra lỗi khi tải thông tin chi tiết lượt chơi.
          </p>
          <Button
            variant='primary'
            className='mt-4'
            onClick={() => router.push('/admin/games')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>
      </Card>
    )
  }

  const { game, bets } = data

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            variant='outline'
            onClick={() => router.push('/admin/games')}
            className='mr-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại
          </Button>
          <h1 className='text-2xl font-bold'>
            Chi tiết lượt chơi #{game.id.substring(0, 8)}
          </h1>
        </div>
        <div className='flex space-x-2'>
          {game.status === 'pending' && (
            <>
              <Button
                variant='outline'
                onClick={() => {
                  setGameData(game)
                  setEditDialogOpen(true)
                }}>
                <Edit className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </Button>
              <Button
                variant='destructive'
                onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className='mr-2 h-4 w-4' />
                Xóa
              </Button>
            </>
          )}
          {game.status === 'active' && (
            <Button
              variant='success'
              onClick={() => setCompleteDialogOpen(true)}>
              <CheckCircle className='mr-2 h-4 w-4' />
              Kết thúc lượt chơi
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <div className='p-6'>
            <h2 className='text-lg font-medium mb-4'>Thông tin lượt chơi</h2>
            <div className='space-y-4'>
              <div>
                <span className='text-sm text-gray-500'>Trạng thái</span>
                <div className='mt-1'>{getStatusBadge(game.status)}</div>
              </div>
              <div>
                <span className='text-sm text-gray-500'>Người tạo</span>
                <div className='mt-1 font-medium'>
                  {game.creator?.phone || game.created_by}
                </div>
              </div>
              <div>
                <span className='text-sm text-gray-500'>Thời gian bắt đầu</span>
                <div className='mt-1 font-medium'>
                  {formatDateTime(game.start_time)}
                </div>
              </div>
              {game.end_time && (
                <div>
                  <span className='text-sm text-gray-500'>
                    Thời gian kết thúc
                  </span>
                  <div className='mt-1 font-medium'>
                    {formatDateTime(game.end_time)}
                  </div>
                </div>
              )}
              {game.winning_number && (
                <div>
                  <span className='text-sm text-gray-500'>Số trúng thưởng</span>
                  <div className='mt-1 font-medium text-2xl text-success-600'>
                    {game.winning_number}
                  </div>
                </div>
              )}
              <div>
                <span className='text-sm text-gray-500'>
                  Tổng tiền đặt cược
                </span>
                <div className='mt-1 font-medium text-primary-600'>
                  {formatCurrency(game.total_bets || 0)}
                </div>
              </div>
              {game.status === 'completed' && (
                <div>
                  <span className='text-sm text-gray-500'>
                    Tổng tiền trả thưởng
                  </span>
                  <div className='mt-1 font-medium text-success-600'>
                    {formatCurrency(game.total_payout || 0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className='col-span-2'>
          <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-medium'>Danh sách đặt cược</h2>
              <Button
                variant='outline'
                size='sm'
                onClick={exportBetsToCSV}
                disabled={!bets || bets.length === 0}>
                <Download className='mr-2 h-4 w-4' />
                Xuất CSV
              </Button>
            </div>

            {!bets || bets.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <Clock className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  Chưa có lượt đặt cược
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Chưa có người chơi nào tham gia lượt chơi này.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Người chơi
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Số đã chọn
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Số tiền
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Thời gian
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Kết quả
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {bets.map((bet: any) => (
                      <tr key={bet.id} className='hover:bg-gray-50'>
                        <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {bet.user?.display_name ||
                            bet.user?.phone ||
                            bet.user_id.substring(0, 8) + '...'}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                          {bet.selected_number}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                          {formatCurrency(bet.amount)}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                          {formatDateTime(bet.created_at)}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm'>
                          {game.status === 'completed' ? (
                            bet.is_winner ? (
                              <Badge variant='success'>Thắng</Badge>
                            ) : (
                              <Badge variant='destructive'>Thua</Badge>
                            )
                          ) : (
                            <Badge variant='secondary'>Chưa xác định</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>

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
                gameData
                  ? new Date(gameData.start_time).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                setGameData({
                  ...gameData,
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
              value={gameData?.status || ''}
              onChange={(e) =>
                setGameData({ ...gameData, status: e.target.value })
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
            onClick={handleUpdateGame}
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
    </div>
  )
}

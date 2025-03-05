'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGameRoundDetails, useCompleteGameRound } from '@/hooks/game-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'
import BetList from '@/components/game/bet-list'

interface AdminGameDetailProps {
  gameId: string
  adminId: string
}

export default function AdminGameDetail({
  gameId,
  adminId,
}: AdminGameDetailProps) {
  const router = useRouter()
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [winningNumber, setWinningNumber] = useState('')
  const [error, setError] = useState('')

  // Fetch game details
  const {
    data,
    isLoading,
    error: fetchError,
  } = useGameRoundDetails(gameId, adminId)

  // Hook for completing a game
  const { mutate: completeGame, isPending: isCompleting } =
    useCompleteGameRound()

  const handleCompleteGame = () => {
    setError('')

    if (!winningNumber) {
      setError('Vui lòng nhập số trúng thưởng')
      return
    }

    completeGame(
      { gameId, winningNumber },
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

  if (fetchError || !data) {
    return (
      <Card className='p-6'>
        <div className='text-center text-red-500'>
          Không thể tải thông tin lượt chơi
        </div>
        <div className='mt-4 text-center'>
          <Link href='/admin/games'>
            <Button variant='primary'>Quay lại danh sách</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const game = data.gameRound
  const bets = data.bets

  return (
    <div className='space-y-6'>
      <Card className='p-6'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='text-xl font-bold'>Thông tin lượt chơi</h2>
            <p className='text-gray-500'>ID: {gameId}</p>
          </div>
          <div>{getStatusBadge(game.status)}</div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Thời gian tạo
            </h3>
            <p className='font-medium'>{formatDateTime(game.created_at)}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Người tạo
            </h3>
            <p className='font-medium'>{game.creator?.phone || 'Admin'}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Thời gian bắt đầu
            </h3>
            <p className='font-medium'>{formatDateTime(game.start_time)}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Thời gian kết thúc
            </h3>
            <p className='font-medium'>
              {game.end_time ? formatDateTime(game.end_time) : '-'}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Tổng tiền đặt cược
            </h3>
            <p className='font-medium text-primary-600'>
              {formatCurrency(game.total_bets || 0)}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Tổng tiền thưởng
            </h3>
            <p className='font-medium text-success-600'>
              {formatCurrency(game.total_payout || 0)}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Số trúng thưởng
            </h3>
            <p className='font-medium text-2xl text-primary-600'>
              {game.winning_number || '-'}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Cập nhật lần cuối
            </h3>
            <p className='font-medium'>{formatDateTime(game.updated_at)}</p>
          </div>
        </div>

        <div className='space-x-4 mt-6 pt-6 border-t border-gray-200'>
          <Link href='/admin/games'>
            <Button variant='outline'>Quay lại danh sách</Button>
          </Link>

          {game.status === 'pending' && (
            <Link href={`/admin/games/${gameId}/edit`}>
              <Button variant='secondary'>Chỉnh sửa</Button>
            </Link>
          )}

          {game.status === 'active' && (
            <Button
              variant='primary'
              onClick={() => setCompleteDialogOpen(true)}>
              Kết thúc lượt chơi
            </Button>
          )}
        </div>
      </Card>

      <BetList
        gameId={gameId}
        filter='all'
        initialBets={bets}
        title='Danh sách đặt cược'
        winningNumber={
          game.status === 'completed' ? game.winning_number : undefined
        }
      />

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
    </div>
  )
}

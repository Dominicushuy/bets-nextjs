// src/components/game/game-detail.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGameRoundDetails, useGameRoundRealtime } from '@/hooks/game-hooks'
import { useExtendedUserProfile } from '@/hooks/profile-hooks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import BetForm from '@/components/game/bet-form'
import BetList from '@/components/game/bet-list'

// Các import mới phát triển
import GameActivity from './game-activity'
import GameStatusChecker from './game-status-checker'
import WinnerAnimation from './winner-animation'
import GameDetailSkeleton from './game-detail-skeleton'
import GameResultBanner from './game-result-banner'
import { Bet } from '@/types/database'

interface GameDetailProps {
  gameId: string
  userId: string
}

export default function GameDetail({ gameId, userId }: GameDetailProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState<number | null>(null)
  const [betSuccessDialogOpen, setBetSuccessDialogOpen] = useState(false)
  const [lastBet, setLastBet] = useState<{
    selectedNumber: string
    amount: number
  } | null>(null)

  // State mới cho phần thắng giải
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false)
  const [winAmount, setWinAmount] = useState(0)

  // Fetch data với React Query
  const { data, isLoading, error } = useGameRoundDetails(gameId, userId)
  const { data: profile, isLoading: profileLoading } =
    useExtendedUserProfile(userId)

  // Cập nhật thời gian thực
  useGameRoundRealtime(gameId)

  const isFullyLoaded = !isLoading && !profileLoading && !!data

  // Trích xuất dữ liệu từ response
  const game = data?.gameRound
  const bets = data?.bets || []
  const userBets = data?.userBets || []
  const userBalance = data?.userBalance || profile?.balance || 0

  // Countdown timer cho game đang active
  useEffect(() => {
    if (game && game.status === 'active') {
      const endTime = new Date()
      endTime.setMinutes(endTime.getMinutes() + 5)
      const interval = setInterval(() => {
        const now = new Date()
        const diff = endTime.getTime() - now.getTime()
        if (diff <= 0) {
          setCountdown(0)
          clearInterval(interval)
        } else {
          setCountdown(Math.floor(diff / 1000))
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [game])

  const formatCountdown = (seconds: number | null) => {
    if (seconds === null) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
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

  const handleBetSuccess = (selectedNumber: string, amount: number) => {
    setLastBet({ selectedNumber, amount })
    setBetSuccessDialogOpen(true)
  }

  // Kiểm tra xem người dùng có cược trúng hay không khi game đã hoàn thành
  useEffect(() => {
    if (isFullyLoaded && game?.status === 'completed' && game.winning_number) {
      const winningBets = userBets.filter(
        (bet: Bet) => bet.selected_number === game.winning_number
      )
      if (winningBets.length > 0) {
        const totalWinAmount = winningBets.reduce(
          (sum: number, bet: Bet) => sum + bet.amount * 80,
          0
        )
        setWinAmount(totalWinAmount)
        // Hiển thị hiệu ứng chiến thắng với delay nhẹ
        setTimeout(() => {
          setShowWinnerAnimation(true)
        }, 1000)
      }
    }
  }, [isFullyLoaded, game, userBets])

  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='bg-red-100 text-red-700 p-4 rounded-lg mb-4'>
          Không thể tải thông tin lượt chơi
        </div>
        <Link href='/games' className='text-primary-600 hover:text-primary-800'>
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  if (!isFullyLoaded) {
    return <GameDetailSkeleton />
  }

  if (!game) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Không tìm thấy lượt chơi
        </h2>
        <Link
          href='/games'
          className='mt-4 inline-block text-primary-600 hover:text-primary-800'>
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const hasWinningBets: boolean = userBets.some(
    (bet: Bet) =>
      bet.selected_number === game.winning_number && game.status === 'completed'
  )

  return (
    <div className='space-y-6'>
      {/* Cập nhật trạng thái game theo thời gian thực */}
      <GameStatusChecker gameId={gameId} currentStatus={game.status} />

      {/* Hiệu ứng chiến thắng */}
      <WinnerAnimation
        show={showWinnerAnimation}
        onClose={() => setShowWinnerAnimation(false)}
        winningNumber={game.winning_number || ''}
        amount={winAmount}
      />

      {/* Nút quay lại và tiêu đề */}
      <div className='mb-6'>
        <Link
          href='/games'
          className='text-primary-600 hover:text-primary-800 flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Quay lại danh sách
        </Link>
        <h2 className='text-2xl font-bold mt-2 text-gray-900'>
          Chi tiết lượt chơi
        </h2>
      </div>

      {/* Banner kết quả game nếu đã hoàn thành */}
      {game.status === 'completed' && game.winning_number && (
        <GameResultBanner
          winningNumber={game.winning_number}
          isWinner={hasWinningBets}
          amountWon={winAmount}
          totalBets={game.total_bets || 0}
          className='mb-6'
        />
      )}

      {/* Nội dung chính chia thành 2 cột */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Cột bên trái */}
        <div className='space-y-6'>
          <Card>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Thông tin lượt chơi
                </h3>
                {getStatusBadge(game.status)}
              </div>

              <div className='space-y-4'>
                <div>
                  <span className='text-sm text-gray-500'>ID lượt chơi:</span>
                  <div className='font-mono text-sm mt-1 bg-gray-100 p-2 rounded overflow-auto'>
                    {game.id}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='text-sm text-gray-500'>Bắt đầu:</span>
                    <div className='font-medium'>
                      {formatDateTime(game.start_time)}
                    </div>
                  </div>

                  {game.end_time && (
                    <div>
                      <span className='text-sm text-gray-500'>Kết thúc:</span>
                      <div className='font-medium'>
                        {formatDateTime(game.end_time)}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className='text-sm text-gray-500'>
                      Tổng tiền cược:
                    </span>
                    <div className='font-medium text-primary-600'>
                      {formatCurrency(game.total_bets || 0)}
                    </div>
                  </div>

                  {game.winning_number && (
                    <div>
                      <span className='text-sm text-gray-500'>Số trúng:</span>
                      <div className='font-bold text-2xl text-success-600'>
                        {game.winning_number}
                      </div>
                    </div>
                  )}
                </div>

                {game.status === 'active' && countdown !== null && (
                  <div className='mt-4'>
                    <div className='text-sm text-gray-500 mb-1'>
                      Thời gian còn lại:
                    </div>
                    <div className='bg-gray-100 rounded-lg p-3 text-center'>
                      <span className='font-mono text-2xl font-bold text-primary-600'>
                        {formatCountdown(countdown)}
                      </span>
                    </div>
                  </div>
                )}

                <div className='mt-4'>
                  <span className='text-sm text-gray-500'>Số dư hiện tại:</span>
                  <div className='font-medium text-lg text-success-600'>
                    {formatCurrency(userBalance)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Activity Feed */}
          <GameActivity gameId={gameId} />

          {/* Lịch sử cược của người dùng */}
          <BetList
            gameId={gameId}
            filter='user'
            userId={userId}
            initialBets={userBets}
            title='Lịch sử cược của bạn'
            winningNumber={
              game.status === 'completed' ? game.winning_number : null
            }
          />
        </div>

        {/* Cột bên phải */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>Đặt cược</h3>
                {game.status === 'active' ? (
                  <Badge variant='success'>Có thể đặt cược</Badge>
                ) : (
                  <Badge variant='destructive'>Không thể đặt cược</Badge>
                )}
              </div>

              {game.status !== 'active' ? (
                <div className='text-center py-8 text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-12 w-12 mx-auto text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='mt-2 text-lg font-medium text-gray-900'>
                    {game.status === 'pending'
                      ? 'Lượt chơi chưa bắt đầu'
                      : game.status === 'completed'
                      ? 'Lượt chơi đã kết thúc'
                      : 'Lượt chơi đã bị hủy'}
                  </h3>
                  <p className='mt-1 text-gray-500'>
                    {game.status === 'pending'
                      ? 'Vui lòng chờ đến khi lượt chơi bắt đầu.'
                      : game.status === 'completed'
                      ? `Số trúng thưởng: ${game.winning_number || 'N/A'}`
                      : 'Lượt chơi này đã bị hủy.'}
                  </p>
                  <div className='mt-6'>
                    <Button
                      variant='primary'
                      onClick={() => router.push('/games')}>
                      Xem lượt chơi khác
                    </Button>
                  </div>
                </div>
              ) : (
                <BetForm
                  gameId={gameId}
                  balance={userBalance}
                  onSuccess={handleBetSuccess}
                />
              )}
            </div>
          </Card>

          {/* Danh sách cược của người chơi khác */}
          <BetList
            gameId={gameId}
            filter='all'
            initialBets={bets}
            title='Người chơi khác đặt cược'
            winningNumber={
              game.status === 'completed' ? game.winning_number : null
            }
          />
        </div>
      </div>

      {/* Dialog thông báo cược thành công */}
      <Dialog
        open={betSuccessDialogOpen}
        onClose={() => setBetSuccessDialogOpen(false)}
        title='Đặt cược thành công!'
        description='Cược của bạn đã được ghi nhận. Chúc bạn may mắn!'>
        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Số đã chọn</p>
              <p className='text-lg font-medium text-gray-900'>
                {lastBet?.selectedNumber}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Số tiền cược</p>
              <p className='text-lg font-medium text-gray-900'>
                {lastBet?.amount?.toLocaleString()} VND
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <Button
            variant='primary'
            onClick={() => setBetSuccessDialogOpen(false)}>
            Đóng
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

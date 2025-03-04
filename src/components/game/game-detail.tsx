'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGameRound, useGameBets, useUserBets } from '@/hooks/game-hooks'
import { useExtendedUserProfile } from '@/hooks/profile-hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import BetForm from '@/components/game/bet-form'
import { Dialog } from '@/components/ui/dialog'

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

  // Fetch data with React Query
  const { data: game, isLoading: gameLoading, error } = useGameRound(gameId)
  const { data: bets, isLoading: betsLoading } = useGameBets(gameId)
  const { data: userBets, isLoading: userBetsLoading } = useUserBets(userId)
  const { data: profile, isLoading: profileLoading } =
    useExtendedUserProfile(userId)

  const isLoading =
    gameLoading || betsLoading || userBetsLoading || profileLoading

  // Filter user bets for this game
  const gameUserBets =
    userBets?.filter((bet) => bet.game_round_id === gameId) || []

  // Filter other users' bets (for display)
  const otherBets = bets?.filter((bet) => bet.user_id !== userId) || []

  // Countdown timer for active games
  useEffect(() => {
    if (game && game.status === 'active') {
      // Example: Set a countdown of 5 minutes from now
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

  if (isLoading) {
    return <Loading />
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

  return (
    <div className='space-y-6'>
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

      {/* Game Information */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Game details */}
        <Card className='lg:col-span-1'>
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
                    {new Date(game.start_time).toLocaleString('vi-VN')}
                  </div>
                </div>

                {game.end_time && (
                  <div>
                    <span className='text-sm text-gray-500'>Kết thúc:</span>
                    <div className='font-medium'>
                      {new Date(game.end_time).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}

                <div>
                  <span className='text-sm text-gray-500'>Tổng tiền cược:</span>
                  <div className='font-medium text-primary-600'>
                    {game.total_bets?.toLocaleString()} VND
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
                  {profile?.balance?.toLocaleString()} VND
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Betting form */}
        <Card className='lg:col-span-2'>
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
                userId={userId}
                gameId={gameId}
                balance={profile?.balance || 0}
                onSuccess={handleBetSuccess}
              />
            )}
          </div>
        </Card>
      </div>

      {/* All Bets */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Your Bets */}
        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Lịch sử cược của bạn</h3>

            {gameUserBets.length === 0 ? (
              <div className='text-center py-6 text-gray-500'>
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
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
                <p className='mt-2'>Bạn chưa đặt cược trong lượt chơi này</p>
              </div>
            ) : (
              <div className='space-y-3 max-h-96 overflow-y-auto pr-1'>
                {gameUserBets.map((bet) => (
                  <div
                    key={bet.id}
                    className={`p-3 border ${
                      bet.is_winner
                        ? 'border-green-200 bg-green-50'
                        : game.status === 'completed'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-white'
                    } rounded-lg`}>
                    <div className='flex justify-between'>
                      <div className='font-medium'>{bet.selected_number}</div>
                      <div className='font-medium'>
                        {bet.amount.toLocaleString()} VND
                      </div>
                    </div>
                    <div className='flex justify-between mt-1 text-xs text-gray-500'>
                      <div>
                        {new Date(bet.created_at).toLocaleString('vi-VN')}
                      </div>
                      {game.status === 'completed' && (
                        <div
                          className={
                            bet.is_winner ? 'text-green-600' : 'text-red-600'
                          }>
                          {bet.is_winner ? 'Thắng ✓' : 'Thua ✗'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Bets from all users */}
        <Card className='lg:col-span-2'>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>
              Người chơi khác đặt cược
            </h3>

            {otherBets.length === 0 ? (
              <div className='text-center py-6 text-gray-500'>
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
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
                <p className='mt-2'>Chưa có người chơi nào đặt cược</p>
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto pr-1'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Người chơi
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Số đã chọn
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tiền cược
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Thời gian
                      </th>
                      {game.status === 'completed' && (
                        <th
                          scope='col'
                          className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Kết quả
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {otherBets.slice(0, 20).map((bet) => (
                      <tr key={bet.id}>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                          {bet.user?.phone
                            ? `${bet.user.phone.substring(
                                0,
                                5
                              )}****${bet.user.phone.substring(
                                bet.user.phone.length - 2
                              )}`
                            : 'Ẩn danh'}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {bet.selected_number}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                          {bet.amount.toLocaleString()} VND
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(bet.created_at).toLocaleTimeString('vi-VN')}
                        </td>
                        {game.status === 'completed' && (
                          <td className='px-4 py-3 whitespace-nowrap text-sm'>
                            {bet.is_winner ? (
                              <span className='text-green-600'>Thắng ✓</span>
                            ) : (
                              <span className='text-red-600'>Thua ✗</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog
        open={betSuccessDialogOpen}
        // onOpenChange={setBetSuccessDialogOpen}
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

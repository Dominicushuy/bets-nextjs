// src/components/game/game-result-detail.tsx
'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGameRoundResults } from '@/hooks/game-hooks'
import { formatCurrency } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { RewardCode } from '@/types/database'

interface GameResultDetailProps {
  gameId: string
  userId: string
}

export default function GameResultDetail({
  gameId,
  userId,
}: GameResultDetailProps) {
  const { data, isLoading, error } = useGameRoundResults(gameId)

  // Hiệu ứng confetti khi người dùng thắng
  useEffect(() => {
    if (data?.isWinner) {
      // Hiệu ứng confetti
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF0000'],
        })

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 },
          colors: ['#00FF00', '#008000', '#0000FF'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()

      // Hiệu ứng lớn ở giữa màn hình
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 1000)
    }
  }, [data?.isWinner])

  if (isLoading) {
    return <Loading />
  }

  if (error || !data) {
    return (
      <Card>
        <div className='p-6 text-center'>
          <p className='text-red-500'>Không thể tải kết quả lượt chơi</p>
          <Link href='/games'>
            <Button variant='primary' className='mt-4'>
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  const { gameRound, isWinner, totalWinAmount, stats } = data

  return (
    <Card>
      <div className={`p-6 ${isWinner ? 'bg-green-50' : 'bg-gray-50'}`}>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold'>Kết quả lượt chơi</h2>
          {isWinner ? (
            <p className='text-green-600 text-lg font-medium mt-2'>
              Chúc mừng! Bạn đã thắng!
            </p>
          ) : (
            <p className='text-gray-600 mt-2'>
              Rất tiếc, bạn không thắng lần này.
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium mb-4'>Thông tin kết quả</h3>

            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                <span>Số trúng thưởng:</span>
                <span className='font-bold text-2xl text-success-600'>
                  {gameRound.winning_number}
                </span>
              </div>

              <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                <span>Trạng thái:</span>
                <Badge variant='primary'>Đã hoàn thành</Badge>
              </div>

              <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                <span>Thời gian kết thúc:</span>
                <span>
                  {new Date(gameRound.end_time).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                <span>Tổng tiền đặt cược:</span>
                <span>{formatCurrency(stats.totalBets)}</span>
              </div>

              <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                <span>Tổng tiền thưởng:</span>
                <span>{formatCurrency(stats.totalPayout)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-4'>Kết quả của bạn</h3>

            {isWinner ? (
              <div className='space-y-4'>
                <div className='p-4 bg-green-100 rounded-lg text-center'>
                  <p className='text-green-700 mb-2'>Chúc mừng bạn đã thắng!</p>
                  <p className='text-3xl font-bold text-green-600'>
                    {formatCurrency(totalWinAmount)}
                  </p>
                </div>

                {data.rewards?.length > 0 && (
                  <div className='mt-4'>
                    <h4 className='font-medium mb-2'>Mã thưởng của bạn:</h4>
                    <div className='space-y-2'>
                      {data.rewards.map((reward: RewardCode) => (
                        <div
                          key={reward.id}
                          className='p-3 border rounded-lg flex justify-between items-center'>
                          <div>
                            <div className='font-mono font-bold'>
                              {reward.code}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {formatCurrency(reward.amount)}
                            </div>
                          </div>

                          {reward.is_used ? (
                            <Badge variant='success'>Đã sử dụng</Badge>
                          ) : (
                            <Button variant='success' size='sm'>
                              Đổi thưởng
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='p-4 bg-gray-100 rounded-lg text-center'>
                <p className='text-gray-700 mb-2'>Bạn không thắng lần này</p>
                <p className='text-lg'>Chúc may mắn lần sau!</p>
              </div>
            )}

            <div className='mt-6 space-y-4'>
              <div className='p-3 bg-white rounded-lg shadow-sm'>
                <p className='text-sm text-gray-500 mb-1'>
                  Tổng số người chơi:
                </p>
                <p className='font-medium'>{stats.totalPlayers}</p>
              </div>

              <div className='p-3 bg-white rounded-lg shadow-sm'>
                <p className='text-sm text-gray-500 mb-1'>Số người thắng:</p>
                <p className='font-medium'>{stats.totalWinners}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 flex justify-center space-x-4'>
          <Link href='/games'>
            <Button variant='primary'>Lượt chơi khác</Button>
          </Link>

          <Link href='/history'>
            <Button variant='outline'>Xem lịch sử</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

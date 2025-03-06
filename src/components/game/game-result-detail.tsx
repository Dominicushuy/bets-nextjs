// src/components/game/game-result-detail.tsx - cập nhật
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGameRoundResults } from '@/hooks/game-hooks'
import { formatCurrency } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { Trophy, ArrowLeft } from 'lucide-react'
import { RewardCode } from '@/types/database'
import GameResultStats from './game-result-stats'
import GameRewardCard from './game-reward-card'

interface GameResultDetailProps {
  gameId: string
  userId: string
}

export default function GameResultDetail({
  gameId,
  userId,
}: GameResultDetailProps) {
  const { data, isLoading, error } = useGameRoundResults(gameId)
  const [showRewards, setShowRewards] = useState(false)

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

  const { gameRound, isWinner, totalWinAmount, stats, rewards = [] } = data

  return (
    <div className='space-y-6'>
      <Card
        className={`overflow-hidden ${
          isWinner ? 'border-green-200' : 'border-gray-200'
        }`}>
        <div className={`p-6 ${isWinner ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold flex items-center'>
              <Trophy className='mr-2 h-6 w-6 text-yellow-500' />
              Kết quả lượt chơi
            </h2>
            <Link href='/games'>
              <Button variant='outline' size='sm' className='flex items-center'>
                <ArrowLeft className='mr-1 h-4 w-4' />
                Quay lại
              </Button>
            </Link>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center mb-6 p-4 bg-white rounded-lg shadow-sm'>
            <div className='flex flex-col items-center mb-4 md:mb-0 md:mr-8'>
              <span className='text-sm text-gray-500 mb-1'>
                Số trúng thưởng
              </span>
              <span className='text-4xl font-bold text-primary-600'>
                {gameRound.winning_number}
              </span>
            </div>

            <div className='h-12 border-r border-gray-200 hidden md:block'></div>

            <div className='flex flex-col items-center md:ml-8'>
              <span className='text-sm text-gray-500 mb-1'>Trạng thái</span>
              <span
                className={`text-lg font-semibold px-4 py-1 rounded-full ${
                  isWinner
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                {isWinner ? 'Thắng cược' : 'Chưa trúng'}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Thông tin chi tiết */}
            <GameResultStats
              gameData={gameRound}
              stats={stats}
              isWinner={isWinner}
            />

            {/* Kết quả của người chơi */}
            <Card>
              <div className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>Kết quả của bạn</h3>

                {isWinner ? (
                  <div className='space-y-4'>
                    <div className='p-4 bg-green-100 rounded-lg text-center'>
                      <p className='text-green-700 mb-2'>
                        Chúc mừng bạn đã thắng!
                      </p>
                      <p className='text-3xl font-bold text-green-600'>
                        {formatCurrency(totalWinAmount)}
                      </p>
                      <p className='text-sm text-green-700 mt-1'>
                        Đã được cộng vào tài khoản của bạn
                      </p>
                    </div>

                    {rewards?.length > 0 && (
                      <div className='mt-6'>
                        <div className='flex justify-between items-center mb-3'>
                          <h4 className='font-medium'>Mã thưởng của bạn</h4>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setShowRewards(!showRewards)}>
                            {showRewards ? 'Ẩn mã' : 'Xem mã'}
                          </Button>
                        </div>

                        {showRewards && (
                          <div className='space-y-3 mt-3'>
                            {rewards.map((reward: RewardCode) => (
                              <GameRewardCard
                                key={reward.id}
                                rewardCode={reward.code}
                                amount={reward.amount}
                                isUsed={reward.is_used}
                                expiryDate={reward.expiry_date}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='p-4 bg-gray-100 rounded-lg text-center'>
                    <p className='text-gray-700 mb-2'>
                      Bạn không thắng lần này
                    </p>
                    <p className='text-lg'>Chúc may mắn lần sau!</p>
                    <p className='text-sm text-gray-600 mt-3'>
                      Hãy tiếp tục tham gia các lượt chơi khác để có cơ hội
                      thắng thưởng
                    </p>
                  </div>
                )}
              </div>
            </Card>
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
    </div>
  )
}

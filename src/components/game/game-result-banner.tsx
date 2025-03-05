// src/components/game/game-result-banner.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface GameResultBannerProps {
  winningNumber: string
  isWinner: boolean
  amountWon?: number
  totalBets?: number
  className?: string
}

export default function GameResultBanner({
  winningNumber,
  isWinner,
  amountWon = 0,
  totalBets = 0,
  className = '',
}: GameResultBannerProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`p-6 ${isWinner ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>
            {isWinner
              ? 'Chúc mừng! Bạn đã thắng!'
              : 'Rất tiếc! Bạn chưa thắng lần này.'}
          </h3>

          <div className='mb-4'>
            <span className='text-sm text-gray-600'>Số trúng thưởng:</span>
            <div
              className={`text-4xl font-bold mt-1 ${
                isWinner ? 'text-green-600' : 'text-red-600'
              }`}>
              {winningNumber}
            </div>
          </div>

          {isWinner && (
            <div className='p-4 bg-white rounded-lg shadow-sm mb-4'>
              <div className='text-sm text-gray-600'>Số tiền thắng:</div>
              <div className='text-3xl font-bold text-green-600'>
                {formatCurrency(amountWon)}
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Đã được cộng vào tài khoản của bạn
              </div>
            </div>
          )}

          <div className='flex justify-center space-x-4 mt-6'>
            <Link href='/games'>
              <Button variant='primary'>Lượt chơi khác</Button>
            </Link>

            {isWinner && (
              <Link href='/history'>
                <Button variant='outline'>Xem lịch sử thắng</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

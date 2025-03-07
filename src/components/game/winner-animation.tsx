// src/components/game/winner-animation.tsx - cập nhật
'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Award, Coins, PlusCircle } from 'lucide-react'
import { useConfetti } from '@/hooks/game-hooks'

interface WinnerAnimationProps {
  show: boolean
  onClose: () => void
  winningNumber: string
  amount: number
}

export default function WinnerAnimation({
  show,
  onClose,
  winningNumber,
  amount,
}: WinnerAnimationProps) {
  const [step, setStep] = useState(1)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Sử dụng hook useConfetti
  const { winnerConfettiEffect } = useConfetti()

  // Trigger confetti effect
  useEffect(() => {
    if (show && step === 1) {
      // Sử dụng hook
      const cleanup = winnerConfettiEffect()

      // Move to next step after 2 seconds
      setTimeout(() => {
        setStep(2)
      }, 2000)

      return cleanup
    }
  }, [show, step, winnerConfettiEffect])

  // Pulse animation for the winning number
  const pulseClass = 'animate-pulse transition-all duration-300'

  return (
    <Dialog open={show} onClose={onClose} title='' className='max-w-md'>
      <div className='text-center py-6'>
        {step === 1 && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-primary-600 mb-4 animate-bounce'>
              Chúc mừng!
            </h2>
            <div className='mb-4'>
              <Award className='h-16 w-16 text-yellow-500 mx-auto mb-2' />
              <p className='text-lg mb-4'>Bạn đã thắng cược!</p>
            </div>
            <div className={pulseClass}>
              <div className='text-4xl font-bold text-success-600 mb-2'>
                {winningNumber}
              </div>
              <p className='text-gray-600'>Là số trúng thưởng</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='space-y-6'>
            <div className='text-2xl font-bold text-success-600 mb-6 flex items-center justify-center'>
              <Coins className='h-8 w-8 mr-2 text-yellow-500' />
              <span>Bạn vừa thắng!</span>
            </div>
            <div className='bg-green-50 p-6 rounded-lg mb-6 transform transition-all duration-500 hover:scale-105'>
              <div className='text-4xl font-bold text-success-600 mb-2 flex items-center justify-center'>
                <span>{formatCurrency(amount)}</span>
                <PlusCircle
                  className={`h-6 w-6 ml-2 text-green-500 ${
                    animationComplete ? 'animate-bounce' : ''
                  }`}
                />
              </div>
              <p className='text-green-600'>
                Đã được cộng vào tài khoản của bạn!
              </p>
            </div>
            <Button
              variant='primary'
              onClick={onClose}
              className='mt-4 px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'>
              Xem chi tiết
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  )
}

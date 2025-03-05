// src/components/game/winner-animation.tsx
'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

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

  // Trigger confetti effect
  useEffect(() => {
    if (show && step === 1) {
      // First wave of confetti
      const duration = 3 * 1000
      const end = Date.now() + duration

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          return
        }

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff'],
        })

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff'],
        })
      }, 150)

      // Move to next step after 2 seconds
      setTimeout(() => {
        setStep(2)
      }, 2000)
    }
  }, [show, step])

  useEffect(() => {
    if (step === 2) {
      // Second wave - big celebration
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FF0000'],
      })
    }
  }, [step])

  return (
    <Dialog open={show} onClose={onClose} title='' className='max-w-md'>
      <div className='text-center py-6'>
        {step === 1 && (
          <>
            <h2 className='text-2xl font-bold text-primary-600 mb-4'>
              Chúc mừng!
            </h2>
            <p className='text-lg mb-4'>Bạn đã thắng cược!</p>
            <div className='animate-pulse'>
              <div className='text-3xl font-bold text-success-600 mb-2'>
                {winningNumber}
              </div>
              <p>Là số trúng thưởng</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className='text-2xl font-bold text-success-600 mb-6'>
              🎉 Bạn vừa thắng 🎉
            </div>
            <div className='bg-green-50 p-6 rounded-lg mb-6'>
              <div className='text-4xl font-bold text-success-600 mb-2 animate-bounce'>
                {formatCurrency(amount)}
              </div>
              <p className='text-green-600'>
                Đã được cộng vào tài khoản của bạn!
              </p>
            </div>
            <Button variant='primary' onClick={onClose} className='mt-4'>
              Xem chi tiết
            </Button>
          </>
        )}
      </div>
    </Dialog>
  )
}

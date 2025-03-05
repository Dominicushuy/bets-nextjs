// src/components/game/game-countdown.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GameCountdownProps {
  endTime: Date | string
  onComplete?: () => void
  className?: string
}

export default function GameCountdown({
  endTime,
  onComplete,
  className = '',
}: GameCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    const endTimeDate =
      typeof endTime === 'string' ? new Date(endTime) : endTime

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = endTimeDate.getTime() - now.getTime()

      if (difference <= 0) {
        // Countdown completed
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 })
        if (onComplete) {
          onComplete()
        }
        return
      }

      // Calculate remaining time
      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        hours,
        minutes,
        seconds,
        total: difference,
      })
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    // Clean up on unmount
    return () => clearInterval(timer)
  }, [endTime, onComplete])

  const padNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <Card className={`p-4 ${className}`}>
      <div className='flex flex-col items-center'>
        <div className='mb-2 flex items-center'>
          <span className='text-sm text-gray-500 mr-2'>Thời gian còn lại:</span>
          <Badge variant='warning' dotIndicator pulsing>
            Sắp kết thúc
          </Badge>
        </div>

        <div className='flex justify-center space-x-2 text-center'>
          <div className='bg-gray-100 rounded-lg p-2 w-16'>
            <div className='text-2xl font-bold text-gray-900'>
              {padNumber(timeLeft.hours)}
            </div>
            <div className='text-xs text-gray-500'>Giờ</div>
          </div>
          <div className='text-xl font-bold py-2'>:</div>
          <div className='bg-gray-100 rounded-lg p-2 w-16'>
            <div className='text-2xl font-bold text-gray-900'>
              {padNumber(timeLeft.minutes)}
            </div>
            <div className='text-xs text-gray-500'>Phút</div>
          </div>
          <div className='text-xl font-bold py-2'>:</div>
          <div className='bg-gray-100 rounded-lg p-2 w-16'>
            <div className='text-2xl font-bold text-gray-900'>
              {padNumber(timeLeft.seconds)}
            </div>
            <div className='text-xs text-gray-500'>Giây</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// src/components/game/game-reward-card.tsx
'use client'

import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useRedeemReward } from '@/hooks/reward-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import RewardQR from '@/components/rewards/reward-qr'
import { Gift, AlertCircle, QrCode, Copy, Check, Clock } from 'lucide-react'

interface GameRewardCardProps {
  rewardCode: string
  amount: number
  isUsed: boolean
  expiryDate: string
  gameId?: string
}

export default function GameRewardCard({
  rewardCode,
  amount,
  isUsed,
  expiryDate,
  gameId,
}: GameRewardCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [confirmRedeemOpen, setConfirmRedeemOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { mutate: redeemReward, isPending: isRedeeming } = useRedeemReward()

  // Tính toán trạng thái phần thưởng
  const isExpired = new Date(expiryDate) < new Date()
  const isAvailable = !isUsed && !isExpired

  // Chuỗi trạng thái hiển thị
  const statusText = isUsed ? 'Đã sử dụng' : isExpired ? 'Hết hạn' : 'Khả dụng'

  // Variant cho Badge hiển thị trạng thái
  const statusVariant = isUsed ? 'info' : isExpired ? 'destructive' : 'success'

  // Hàm xử lý copy mã
  const handleCopyCode = () => {
    navigator.clipboard.writeText(rewardCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Hàm xử lý đổi thưởng
  const handleRedeem = () => {
    redeemReward(rewardCode, {
      onSuccess: () => {
        setConfirmRedeemOpen(false)
      },
    })
  }

  // Tính toán thời gian còn lại
  const timeLeft = () => {
    const now = new Date()
    const expiry = new Date(expiryDate)

    if (now > expiry) return 'Đã hết hạn'

    const diffTime = Math.abs(expiry.getTime() - now.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays} ngày`

    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    if (diffHours > 0) return `${diffHours} giờ`

    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffMinutes} phút`
  }

  return (
    <>
      <Card className='overflow-hidden'>
        <div
          className={`h-2 w-full ${
            isAvailable
              ? 'bg-success-500'
              : isUsed
              ? 'bg-blue-500'
              : 'bg-red-500'
          }`}></div>
        <div className='p-4'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center'>
              <Gift
                className={`h-5 w-5 mr-2 ${
                  isAvailable
                    ? 'text-success-500'
                    : isUsed
                    ? 'text-blue-500'
                    : 'text-red-500'
                }`}
              />
              <span className='font-medium'>Mã thưởng:</span>
            </div>
            <Badge variant={statusVariant} size='sm'>
              {statusText}
            </Badge>
          </div>

          <div className='mt-2 flex justify-between items-center'>
            <div className='bg-gray-100 px-3 py-1.5 rounded-md font-mono text-lg font-bold tracking-wider'>
              {rewardCode}
            </div>
            <button
              onClick={handleCopyCode}
              className='p-1.5 text-gray-500 hover:text-gray-800 focus:outline-none rounded-md hover:bg-gray-100'
              aria-label='Copy code'>
              {copied ? (
                <Check className='h-5 w-5 text-success-500' />
              ) : (
                <Copy className='h-5 w-5' />
              )}
            </button>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-2'>
            <div>
              <div className='text-sm text-gray-500'>Giá trị</div>
              <div className='font-semibold text-success-600'>
                {formatCurrency(amount)}
              </div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Hết hạn</div>
              <div className='font-medium flex items-center'>
                <Clock className='h-4 w-4 mr-1 text-gray-400' />
                {isExpired ? (
                  <span className='text-red-500'>Đã hết hạn</span>
                ) : (
                  <span className='text-gray-700'>Còn {timeLeft()}</span>
                )}
              </div>
            </div>
          </div>

          <div className='flex justify-between mt-4 gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1'
              onClick={() => setShowQR(true)}>
              <QrCode className='h-4 w-4 mr-1' />
              Mã QR
            </Button>

            {isAvailable && (
              <Button
                variant='primary'
                size='sm'
                className='flex-1'
                onClick={() => setConfirmRedeemOpen(true)}>
                Đổi thưởng
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* QR Code Dialog */}
      {showQR && (
        <Dialog
          open={showQR}
          onClose={() => setShowQR(false)}
          title='Mã QR phần thưởng'
          description='Sử dụng mã QR này để chia sẻ hoặc đổi thưởng.'>
          <div className='flex flex-col items-center'>
            <RewardQR code={rewardCode} size={200} />
            <div className='mt-4 bg-gray-100 px-3 py-2 rounded-md w-full text-center font-mono'>
              {rewardCode}
            </div>
            <div className='mt-4 text-success-600 font-semibold'>
              {formatCurrency(amount)}
            </div>
            <Button
              variant='outline'
              className='mt-4 w-full'
              onClick={() => setShowQR(false)}>
              Đóng
            </Button>
          </div>
        </Dialog>
      )}

      {/* Confirm Redeem Dialog */}
      {confirmRedeemOpen && (
        <Dialog
          open={confirmRedeemOpen}
          onClose={() => !isRedeeming && setConfirmRedeemOpen(false)}
          title='Xác nhận đổi thưởng'>
          <div className='flex flex-col items-center mt-2'>
            <AlertCircle className='h-12 w-12 text-warning-500 mb-2' />
            <p className='text-center mb-4'>
              Bạn có chắc chắn muốn đổi thưởng mã{' '}
              <span className='font-bold'>{rewardCode}</span> với giá trị{' '}
              <span className='font-bold text-success-600'>
                {formatCurrency(amount)}
              </span>
              ?
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              Hành động này không thể hoàn tác. Số tiền sẽ được cộng vào tài
              khoản của bạn.
            </p>
            <div className='flex gap-3 w-full'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setConfirmRedeemOpen(false)}
                disabled={isRedeeming}>
                Huỷ bỏ
              </Button>
              <Button
                variant='primary'
                className='flex-1'
                onClick={handleRedeem}
                loading={isRedeeming}>
                Xác nhận
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

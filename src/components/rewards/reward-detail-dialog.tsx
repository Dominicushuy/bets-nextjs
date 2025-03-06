// src/components/rewards/reward-detail-dialog.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RewardCode } from '@/types/database'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import RewardQR from './reward-qr'
import { useRedeemReward } from '@/hooks/reward-hooks'
import {
  Gift,
  Clock,
  CalendarDays,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  Award,
} from 'lucide-react'

interface RewardDetailDialogProps {
  reward: RewardCode | null
  isOpen: boolean
  onClose: () => void
  onRedeemed?: () => void
}

export default function RewardDetailDialog({
  reward,
  isOpen,
  onClose,
  onRedeemed,
}: RewardDetailDialogProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const { mutate: redeemReward, isPending } = useRedeemReward()

  if (!reward) return null

  const isExpired = new Date(reward.expiry_date) < new Date()
  const isAvailable = !reward.is_used && !isExpired

  // Tính thời gian còn lại
  const getTimeRemaining = () => {
    if (isExpired || reward.is_used) return '0 ngày'

    const now = new Date()
    const expiry = new Date(reward.expiry_date)
    const diffTime = Math.max(0, expiry.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 1) return `${diffDays} ngày`

    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    if (diffHours > 1) return `${diffHours} giờ`

    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    return `${diffMinutes} phút`
  }

  // Xử lý đổi thưởng
  const handleRedeem = () => {
    redeemReward(reward.code, {
      onSuccess: () => {
        if (onRedeemed) onRedeemed()
      },
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => !isPending && !isRedeeming && onClose()}
      title='Chi tiết phần thưởng'>
      <div className='p-4'>
        {isRedeeming ? (
          // Màn hình xác nhận đổi thưởng
          <div className='space-y-6'>
            <div className='text-center py-2'>
              <AlertTriangle className='h-12 w-12 mx-auto text-warning-500 mb-2' />
              <h3 className='text-lg font-medium text-gray-900'>
                Xác nhận đổi thưởng
              </h3>
              <p className='text-sm text-gray-500 mt-1'>
                Bạn chắc chắn muốn đổi phần thưởng này thành tiền vào tài khoản?
              </p>
            </div>

            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Mã thưởng:</span>
                <span className='font-medium'>{reward.code}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Giá trị:</span>
                <span className='font-semibold text-green-600'>
                  {formatCurrency(reward.amount)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Hạn sử dụng:</span>
                <span>{formatDate(reward.expiry_date)}</span>
              </div>
            </div>

            <div className='flex justify-end space-x-3'>
              <Button
                variant='outline'
                onClick={() => setIsRedeeming(false)}
                disabled={isPending}>
                <X className='h-4 w-4 mr-1' />
                Hủy
              </Button>
              <Button
                variant='primary'
                onClick={handleRedeem}
                loading={isPending}
                disabled={isPending}>
                <Check className='h-4 w-4 mr-1' />
                Xác nhận
              </Button>
            </div>
          </div>
        ) : (
          // Màn hình chi tiết phần thưởng
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <RewardQR
                code={reward.code}
                size={200}
                includeText
                downloadable
                fileName={`reward-${reward.code}`}
                logo='/images/logo-small.png'
                color={
                  reward.is_used ? '#10b981' : isExpired ? '#ef4444' : '#4f46e5'
                }
              />
            </div>

            <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
              <div className='flex items-center text-lg font-medium text-gray-900'>
                <Gift className='h-5 w-5 mr-2 text-primary-500' />
                Chi tiết phần thưởng
              </div>

              <div className='grid grid-cols-1 gap-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-500 flex items-center'>
                    <DollarSign className='h-4 w-4 mr-1' />
                    Giá trị:
                  </span>
                  <span className='font-semibold text-green-600'>
                    {formatCurrency(reward.amount)}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-500 flex items-center'>
                    <Award className='h-4 w-4 mr-1' />
                    Trạng thái:
                  </span>
                  <span
                    className={`font-medium ${
                      reward.is_used
                        ? 'text-green-600'
                        : isExpired
                        ? 'text-red-600'
                        : 'text-primary-600'
                    }`}>
                    {reward.is_used
                      ? 'Đã sử dụng'
                      : isExpired
                      ? 'Đã hết hạn'
                      : 'Khả dụng'}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-500 flex items-center'>
                    <Clock className='h-4 w-4 mr-1' />
                    Thời hạn còn lại:
                  </span>
                  <span className='font-medium'>{getTimeRemaining()}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-500 flex items-center'>
                    <CalendarDays className='h-4 w-4 mr-1' />
                    Ngày hết hạn:
                  </span>
                  <span>{formatDateTime(reward.expiry_date)}</span>
                </div>

                {reward.is_used && reward.redeemed_date && (
                  <div className='flex justify-between'>
                    <span className='text-gray-500 flex items-center'>
                      <Check className='h-4 w-4 mr-1' />
                      Ngày sử dụng:
                    </span>
                    <span>{formatDateTime(reward.redeemed_date)}</span>
                  </div>
                )}

                {reward.game && (
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Từ lượt chơi:</span>
                    <span className='font-medium text-primary-600'>
                      {reward.game.id.substring(0, 8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='flex justify-end space-x-3'>
              <Button variant='outline' onClick={onClose}>
                Đóng
              </Button>

              {isAvailable && (
                <Button variant='primary' onClick={() => setIsRedeeming(true)}>
                  <RefreshCw className='h-4 w-4 mr-1' />
                  Đổi thưởng
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}

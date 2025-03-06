// src/components/game/game-reward-card.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'
import { useRedeemReward } from '@/hooks/reward-hooks'
import { Gift, Copy, Check, AlertCircle } from 'lucide-react'
import QRCode from 'react-qr-code'

interface GameRewardCardProps {
  rewardCode: string
  amount: number
  isUsed: boolean
  expiryDate: string
}

export default function GameRewardCard({
  rewardCode,
  amount,
  isUsed,
  expiryDate,
}: GameRewardCardProps) {
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const { mutate: redeemReward, isPending } = useRedeemReward()

  const isExpired = new Date(expiryDate) < new Date()
  const canRedeem = !isUsed && !isExpired

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewardCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRedeem = () => {
    if (canRedeem) {
      redeemReward(rewardCode)
    }
  }

  // Format expiry date
  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
          isUsed
            ? 'opacity-75'
            : isExpired
            ? 'border-red-200'
            : 'border-green-200'
        }`}>
        <div
          className={`p-5 ${
            isUsed ? 'bg-gray-50' : isExpired ? 'bg-red-50' : 'bg-green-50'
          }`}>
          <div className='flex justify-between items-start'>
            <div className='flex items-center'>
              <Gift
                className={`h-5 w-5 mr-2 ${
                  isUsed
                    ? 'text-gray-500'
                    : isExpired
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              />
              <h3 className='font-medium'>Mã thưởng</h3>
            </div>
            {isUsed ? (
              <Badge variant='secondary'>Đã sử dụng</Badge>
            ) : isExpired ? (
              <Badge variant='destructive'>Hết hạn</Badge>
            ) : (
              <Badge variant='success'>Khả dụng</Badge>
            )}
          </div>

          <div className='mt-3 flex items-center justify-between'>
            <div className='font-mono text-lg font-bold'>{rewardCode}</div>
            <button
              onClick={copyToClipboard}
              className='p-1 rounded-full hover:bg-gray-200 transition-colors'
              title='Sao chép mã'>
              {copied ? (
                <Check className='h-5 w-5 text-green-500' />
              ) : (
                <Copy className='h-5 w-5 text-gray-500' />
              )}
            </button>
          </div>

          <div className='mt-4 flex justify-between items-center'>
            <div>
              <div className='text-sm text-gray-600'>Giá trị:</div>
              <div className='font-semibold text-lg'>
                {formatCurrency(amount)}
              </div>
            </div>
            <div>
              <div className='text-sm text-gray-600'>Hết hạn:</div>
              <div
                className={`text-sm ${
                  isExpired ? 'text-red-600 font-medium' : 'text-gray-700'
                }`}>
                {formatExpiry(expiryDate)}
              </div>
            </div>
          </div>
        </div>

        <div className='p-4 bg-white flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1'
            onClick={() => setShowQRDialog(true)}>
            Xem QR
          </Button>
          <Button
            variant='primary'
            size='sm'
            className='flex-1'
            disabled={!canRedeem || isPending}
            loading={isPending}
            onClick={handleRedeem}>
            {isUsed ? 'Đã đổi' : 'Đổi thưởng'}
          </Button>
        </div>
      </Card>

      {/* QR Code Dialog */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        title='Mã QR thưởng'
        description='Quét mã QR này để sử dụng mã thưởng của bạn'>
        <div className='flex flex-col items-center justify-center p-6'>
          <div className='bg-white p-4 rounded-lg mb-4'>
            <QRCode value={rewardCode} size={200} level='M' />
          </div>
          <div className='text-center mb-4'>
            <p className='font-mono font-bold text-lg'>{rewardCode}</p>
            <p className='text-sm text-gray-600 mt-1'>
              Giá trị: {formatCurrency(amount)}
            </p>
          </div>

          {isExpired && (
            <div className='flex items-center text-red-600 bg-red-50 p-3 rounded-lg mb-4'>
              <AlertCircle className='h-5 w-5 mr-2' />
              <span>Mã thưởng đã hết hạn vào {formatExpiry(expiryDate)}</span>
            </div>
          )}

          {isUsed && (
            <div className='flex items-center text-gray-600 bg-gray-100 p-3 rounded-lg mb-4'>
              <Check className='h-5 w-5 mr-2' />
              <span>Mã thưởng này đã được sử dụng</span>
            </div>
          )}
        </div>

        <div className='flex justify-end space-x-3'>
          <Button variant='outline' onClick={() => setShowQRDialog(false)}>
            Đóng
          </Button>
          {canRedeem && (
            <Button
              variant='primary'
              disabled={isPending}
              loading={isPending}
              onClick={handleRedeem}>
              Đổi thưởng
            </Button>
          )}
        </div>
      </Dialog>
    </>
  )
}

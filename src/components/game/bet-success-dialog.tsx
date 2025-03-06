// src/components/game/bet-success-dialog.tsx
'use client'

import { useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { CheckCircle } from 'lucide-react'

interface BetSuccessDialogProps {
  open: boolean
  onClose: () => void
  selectedNumber: string
  amount: number
}

export default function BetSuccessDialog({
  open,
  onClose,
  selectedNumber,
  amount,
}: BetSuccessDialogProps) {
  // Launch confetti effect when dialog opens
  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b'],
      })
    }
  }, [open])

  return (
    <Dialog
      // src/components/game/bet-success-dialog.tsx (tiếp theo)
      open={open}
      onClose={onClose}
      title='Đặt cược thành công!'
      description='Cược của bạn đã được ghi nhận. Chúc bạn may mắn!'>
      <div className='my-8 flex flex-col items-center justify-center space-y-4'>
        <div className='h-16 w-16 rounded-full bg-green-100 flex items-center justify-center'>
          <CheckCircle className='h-10 w-10 text-green-600' />
        </div>

        <div className='mt-6 p-4 bg-gray-50 rounded-lg w-full'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <p className='text-sm text-gray-500'>Số đã chọn</p>
              <p className='text-2xl font-medium text-gray-900'>
                {selectedNumber}
              </p>
            </div>
            <div className='text-center'>
              <p className='text-sm text-gray-500'>Số tiền cược</p>
              <p className='text-2xl font-medium text-primary-600'>
                {formatCurrency(amount)}
              </p>
            </div>
          </div>
        </div>

        <p className='text-sm text-gray-500 text-center mt-4'>
          Lưu ý: Kết quả sẽ được thông báo ngay khi lượt chơi kết thúc.
        </p>
      </div>

      <div className='mt-6 flex justify-end'>
        <Button variant='primary' onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Dialog>
  )
}

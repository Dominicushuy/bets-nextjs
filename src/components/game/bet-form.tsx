'use client'

import { useState } from 'react'
import { usePlaceBet } from '@/hooks/game-hooks'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

interface BetFormProps {
  userId: string
  gameId: string
  balance: number
  onSuccess: (selectedNumber: string, amount: number) => void
}

export default function BetForm({
  userId,
  gameId,
  balance,
  onSuccess,
}: BetFormProps) {
  // Common numbers that users typically choose
  const commonNumbers = ['7', '8', '9', '68', '88', '99']

  // Predefined bet amounts
  const predefinedAmounts = [10000, 50000, 100000, 500000, 1000000]

  const [selectedNumber, setSelectedNumber] = useState('')
  const [betAmount, setBetAmount] = useState(10000)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [error, setError] = useState('')

  const { mutate: placeBet, isPending: isSubmitting } = usePlaceBet()

  const handlePlaceBet = () => {
    // Validate input
    setError('')

    if (!selectedNumber.trim()) {
      setError('Vui lòng nhập số bạn muốn đặt cược')
      return
    }

    if (betAmount < 10000) {
      setError('Số tiền cược tối thiểu là 10,000 VND')
      return
    }

    if (balance < betAmount) {
      setError('Số dư không đủ')
      return
    }

    // Open confirmation dialog
    setConfirmDialogOpen(true)
  }

  const confirmPlaceBet = () => {
    placeBet(
      {
        userId,
        gameRoundId: gameId,
        selectedNumber,
        amount: betAmount,
      },
      {
        onSuccess: () => {
          setConfirmDialogOpen(false)
          onSuccess(selectedNumber, betAmount)

          // Reset form
          setSelectedNumber('')
          setBetAmount(10000)
        },
        onError: (error: any) => {
          setConfirmDialogOpen(false)
          setError(error.message || 'Lỗi khi đặt cược')
        },
      }
    )
  }

  return (
    <div className='space-y-6'>
      {error && (
        <div className='p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Chọn số
        </label>
        <div className='flex flex-wrap gap-2 mb-3'>
          {commonNumbers.map((num) => (
            <button
              key={num}
              type='button'
              onClick={() => setSelectedNumber(num)}
              className={`px-4 py-2 rounded-md ${
                selectedNumber === num
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
              {num}
            </button>
          ))}
        </div>
        <input
          type='text'
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
          className='w-full px-4 py-3 text-lg text-center border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium'
          placeholder='Nhập số bạn chọn'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Số tiền cược
        </label>
        <div className='flex flex-wrap gap-2 mb-3'>
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              type='button'
              onClick={() => setBetAmount(amount)}
              className={`px-3 py-1 rounded-md ${
                betAmount === amount
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
              {amount.toLocaleString()} VND
            </button>
          ))}
        </div>
        <div className='flex space-x-2'>
          <button
            type='button'
            className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold text-xl'
            onClick={() => setBetAmount(Math.max(10000, betAmount - 10000))}>
            -
          </button>
          <input
            type='number'
            min='10000'
            step='10000'
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className='w-full px-4 py-3 text-lg text-center border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium'
          />
          <button
            type='button'
            className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold text-xl'
            onClick={() => setBetAmount(betAmount + 10000)}>
            +
          </button>
        </div>
        <div className='mt-1 text-sm text-gray-500'>
          Số tiền cược tối thiểu: 10,000 VND
        </div>
      </div>

      <div>
        <Button
          variant='success'
          size='lg'
          className='w-full'
          disabled={isSubmitting || !selectedNumber.trim() || betAmount < 10000}
          onClick={handlePlaceBet}>
          {isSubmitting ? 'Đang xử lý...' : 'Đặt cược'}
        </Button>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        // onOpenChange={setConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title='Xác nhận đặt cược'
        description='Bạn có chắc chắn muốn đặt cược với thông tin dưới đây?'>
        <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Số đã chọn</p>
              <p className='text-lg font-medium text-gray-900'>
                {selectedNumber}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Số tiền cược</p>
              <p className='text-lg font-medium text-gray-900'>
                {betAmount.toLocaleString()} VND
              </p>
            </div>
          </div>
        </div>
        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='secondary'
            onClick={() => setConfirmDialogOpen(false)}
            disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant='success'
            onClick={confirmPlaceBet}
            loading={isSubmitting}>
            Xác nhận đặt cược
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

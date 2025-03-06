// src/components/game/bet-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePlaceBet } from '@/hooks/game-hooks'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { AlertCircle } from 'lucide-react'

interface BetFormProps {
  gameId: string
  balance: number
  onSuccess?: (selectedNumber: string, amount: number) => void
  disabled?: boolean
}

export default function BetForm({
  gameId,
  balance,
  onSuccess,
  disabled = false,
}: BetFormProps) {
  // Common numbers that users typically choose
  const commonNumbers = ['7', '8', '9', '68', '88', '99']

  // Predefined bet amounts
  const predefinedAmounts = [10000, 50000, 100000, 500000, 1000000]

  const [selectedNumber, setSelectedNumber] = useState('')
  const [betAmount, setBetAmount] = useState(10000)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    number?: string
    amount?: string
  }>({})

  const queryClient = useQueryClient()
  const { mutate: placeBet, isPending: isSubmitting } = usePlaceBet()

  // Validation effect
  useEffect(() => {
    const errors: { number?: string; amount?: string } = {}

    // Validate number
    if (selectedNumber) {
      if (!/^\d+$/.test(selectedNumber)) {
        errors.number = 'Số phải là số nguyên dương'
      }
    }

    // Validate amount
    if (betAmount) {
      if (betAmount < 10000) {
        errors.amount = 'Số tiền cược tối thiểu là 10,000 VND'
      } else if (betAmount > balance) {
        errors.amount = 'Số dư không đủ'
      }
    }

    setValidationErrors(errors)
  }, [selectedNumber, betAmount, balance])

  const isValid =
    !validationErrors.number &&
    !validationErrors.amount &&
    selectedNumber.trim() !== ''

  const handlePlaceBet = () => {
    // Reset error state
    setError('')

    // Basic validation
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
        gameRoundId: gameId,
        selectedNumber,
        amount: betAmount,
      },
      {
        onSuccess: () => {
          setConfirmDialogOpen(false)
          if (onSuccess) {
            onSuccess(selectedNumber, betAmount)
          }

          // Reset form
          setSelectedNumber('')
          setBetAmount(10000)

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['profile'] })

          // Show success toast
          toast.success('Đặt cược thành công!')
        },
        onError: (error: any) => {
          setConfirmDialogOpen(false)
          setError(error.message || 'Lỗi khi đặt cược')
          toast.error(error.message || 'Lỗi khi đặt cược')
        },
      }
    )
  }

  return (
    <div className='space-y-6'>
      {error && (
        <div className='p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start'>
          <AlertCircle className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0' />
          <span>{error}</span>
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
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedNumber === num
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              disabled={disabled || isSubmitting}>
              {num}
            </button>
          ))}
        </div>
        <div className='relative'>
          <input
            type='text'
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            className={`w-full px-4 py-3 text-lg text-center border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium transition-all duration-200
              ${
                validationErrors.number
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300'
              }`}
            placeholder='Nhập số bạn chọn'
            disabled={disabled || isSubmitting}
          />
          {validationErrors.number && (
            <p className='mt-1 text-sm text-red-600 flex items-center'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {validationErrors.number}
            </p>
          )}
        </div>
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
              className={`px-3 py-1 rounded-md transition-all duration-200 ${
                betAmount === amount
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${amount > balance ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled || isSubmitting || amount > balance}>
              {amount.toLocaleString()} VND
            </button>
          ))}
        </div>
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold text-xl transition-colors duration-150'
            onClick={() => setBetAmount(Math.max(10000, betAmount - 10000))}
            disabled={disabled || isSubmitting || betAmount <= 10000}>
            -
          </button>
          <div className='relative flex-1'>
            <input
              type='number'
              min='10000'
              step='10000'
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className={`w-full px-4 py-3 text-lg text-center border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium transition-all duration-200
                ${
                  validationErrors.amount
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300'
                }`}
              disabled={disabled || isSubmitting}
            />
          </div>
          <button
            type='button'
            className='px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold text-xl transition-colors duration-150'
            onClick={() => setBetAmount(betAmount + 10000)}
            disabled={disabled || isSubmitting || betAmount + 10000 > balance}>
            +
          </button>
        </div>
        {validationErrors.amount ? (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-1' />
            {validationErrors.amount}
          </p>
        ) : (
          <div className='mt-1 text-sm text-gray-500'>
            Số tiền cược tối thiểu: 10,000 VND
          </div>
        )}
      </div>

      <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
        <span className='text-gray-700'>Số dư hiện tại:</span>
        <span className='font-medium text-green-600'>
          {formatCurrency(balance)}
        </span>
      </div>

      <div className='pt-2'>
        <Button
          variant='success'
          size='lg'
          className='w-full rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'
          disabled={disabled || isSubmitting || !isValid}
          onClick={handlePlaceBet}>
          {isSubmitting ? 'Đang xử lý...' : 'Đặt cược'}
        </Button>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
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

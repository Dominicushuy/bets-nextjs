'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useExtendedUserProfile } from '@/hooks/profile-hooks'
import { useCreatePaymentRequest } from '@/hooks/payment-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'

interface PaymentRequestFormProps {
  userId: string
}

export default function PaymentRequestForm({
  userId,
}: PaymentRequestFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profile, isLoading: profileLoading } =
    useExtendedUserProfile(userId)
  const { mutate: createPaymentRequest, isPending: isSubmitting } =
    useCreatePaymentRequest()

  const [amount, setAmount] = useState(50000)
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= 10000) {
      setAmount(value)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }

    const file = files[0]

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng tải lên file hình ảnh')
      return
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file quá lớn (tối đa 5MB)')
      return
    }

    setProofImage(file)
    setError('')

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError('')
    setSuccess('')

    // Kiểm tra đầu vào
    if (amount < 10000) {
      setError('Số tiền tối thiểu là 10,000 VND')
      return
    }

    if (!proofImage) {
      setError('Vui lòng tải lên hình ảnh bằng chứng thanh toán')
      return
    }

    // Submit payment request
    createPaymentRequest(
      { amount, proofImage },
      {
        onSuccess: () => {
          setSuccess(
            'Yêu cầu thanh toán đã được gửi thành công. Vui lòng chờ xử lý từ admin.'
          )
          setAmount(50000)
          setProofImage(null)
          setPreviewUrl('')

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
        onError: (error: any) => {
          setError(error.message || 'Lỗi khi gửi yêu cầu thanh toán')
        },
      }
    )
  }

  if (profileLoading) {
    return <Loading />
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <Card className='md:col-span-1'>
        <div className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Thông tin tài khoản</h3>

          <div className='space-y-3'>
            <div>
              <span className='text-sm text-gray-600'>Số điện thoại:</span>
              <div className='font-medium'>{profile?.phone}</div>
            </div>

            <div>
              <span className='text-sm text-gray-600'>Số dư hiện tại:</span>
              <div className='font-medium text-green-600'>
                {profile?.balance?.toLocaleString()} VND
              </div>
            </div>

            <div className='pt-4'>
              <h4 className='text-md font-medium mb-2'>Hướng dẫn nạp tiền</h4>
              <ol className='list-decimal list-inside text-sm text-gray-600 space-y-1'>
                <li>Chuyển tiền vào tài khoản ngân hàng của admin</li>
                <li>Chụp ảnh màn hình hoặc biên lai chuyển khoản</li>
                <li>Điền số tiền và tải lên hình ảnh bằng chứng</li>
                <li>Gửi yêu cầu và chờ admin xác nhận</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      <Card className='md:col-span-2'>
        <div className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Tạo yêu cầu nạp tiền</h3>

          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
              {error}
            </div>
          )}

          {success && (
            <div className='mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm'>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Số tiền nạp
              </label>
              <div className='flex space-x-2'>
                <button
                  type='button'
                  className='px-3 py-2 bg-gray-200 rounded-md'
                  onClick={() => setAmount(Math.max(10000, amount - 50000))}>
                  -
                </button>
                <input
                  type='number'
                  min='10000'
                  step='10000'
                  value={amount}
                  onChange={handleAmountChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                />
                <button
                  type='button'
                  className='px-3 py-2 bg-gray-200 rounded-md'
                  onClick={() => setAmount(amount + 50000)}>
                  +
                </button>
              </div>
              <div className='mt-1 text-sm text-gray-500'>
                Số tiền tối thiểu: 10,000 VND
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Hình ảnh bằng chứng thanh toán
              </label>
              <input
                ref={fileInputRef}
                id='proof-image'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100'
              />
              <div className='mt-1 text-sm text-gray-500'>
                Hình ảnh hóa đơn, màn hình chuyển khoản hoặc bằng chứng thanh
                toán khác
              </div>
            </div>

            {previewUrl && (
              <div className='mb-4'>
                <div className='text-sm font-medium text-gray-700 mb-1'>
                  Xem trước hình ảnh
                </div>
                <div className='mt-2 relative'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='max-h-48 rounded-md border border-gray-200'
                  />
                  <button
                    type='button'
                    onClick={() => {
                      setProofImage(null)
                      setPreviewUrl('')
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 text-gray-500'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div>
              <Button
                type='submit'
                variant='primary'
                className='w-full'
                loading={isSubmitting}>
                Gửi yêu cầu
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

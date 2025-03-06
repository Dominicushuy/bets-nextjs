'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useExtendedUserProfile } from '@/hooks/profile-hooks'
import { useCreatePaymentRequest } from '@/hooks/payment-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Camera, CreditCard, BanknoteIcon, InfoIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { UploadProof } from '@/components/payment/upload-proof'

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
  const [step, setStep] = useState<'amount' | 'upload' | 'confirm'>('amount')

  // Mảng các giá trị nạp tiền phổ biến
  const commonAmounts = [50000, 100000, 200000, 500000, 1000000]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= 10000) {
      setAmount(value)
    }
  }

  const handleSetAmount = (value: number) => {
    setAmount(value)
  }

  const handleFileSelect = (file: File, preview: string) => {
    setProofImage(file)
    setPreviewUrl(preview)
    setError('')
  }

  const handleFileRemove = () => {
    setProofImage(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleNextStep = () => {
    // Validate current step
    if (step === 'amount') {
      if (amount < 10000) {
        setError('Số tiền tối thiểu là 10,000 VND')
        return
      }
      setError('')
      setStep('upload')
    } else if (step === 'upload') {
      if (!proofImage) {
        setError('Vui lòng tải lên hình ảnh bằng chứng thanh toán')
        return
      }
      setError('')
      setStep('confirm')
    }
  }

  const handlePrevStep = () => {
    if (step === 'upload') {
      setStep('amount')
    } else if (step === 'confirm') {
      setStep('upload')
    }
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
        onSuccess: (data) => {
          setSuccess(
            'Yêu cầu thanh toán đã được gửi thành công. Vui lòng chờ xử lý từ admin.'
          )
          setAmount(50000)
          setProofImage(null)
          setPreviewUrl('')
          setStep('amount')

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }

          // Sau 2 giây, chuyển về trang lịch sử
          setTimeout(() => {
            router.push('/history?tab=payments')
          }, 2000)
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
                {formatCurrency(profile?.balance || 0)}
              </div>
            </div>

            <div className='pt-4'>
              <h4 className='text-md font-medium mb-2 flex items-center'>
                <InfoIcon className='h-4 w-4 mr-1 text-primary-500' />
                Hướng dẫn nạp tiền
              </h4>
              <ol className='list-decimal list-inside text-sm text-gray-600 space-y-1'>
                <li>Chuyển tiền vào tài khoản ngân hàng của admin</li>
                <li>Chụp ảnh màn hình hoặc biên lai chuyển khoản</li>
                <li>Điền số tiền và tải lên hình ảnh bằng chứng</li>
                <li>Gửi yêu cầu và chờ admin xác nhận</li>
              </ol>
            </div>

            <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
              <h5 className='text-sm font-medium text-yellow-800 mb-1'>
                Thông tin chuyển khoản:
              </h5>
              <div className='text-sm text-gray-700 space-y-1'>
                <p>
                  <span className='font-medium'>Ngân hàng:</span> Vietcombank
                </p>
                <p>
                  <span className='font-medium'>Số tài khoản:</span> 1234567890
                </p>
                <p>
                  <span className='font-medium'>Chủ tài khoản:</span> NGUYEN VAN
                  A
                </p>
                <p>
                  <span className='font-medium'>Nội dung CK:</span> NAP{' '}
                  {profile?.phone}
                </p>
              </div>
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
            {/* Bước 1: Chọn số tiền */}
            {step === 'amount' && (
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label
                    htmlFor='amount'
                    className='block text-sm font-medium text-gray-700'>
                    Số tiền nạp
                  </label>
                  <div className='flex space-x-2'>
                    <button
                      type='button'
                      className='px-3 py-2 bg-gray-200 rounded-md'
                      onClick={() =>
                        setAmount(Math.max(10000, amount - 50000))
                      }>
                      -
                    </button>
                    <input
                      type='number'
                      id='amount'
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

                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-700'>
                    Số tiền phổ biến
                  </p>
                  <div className='grid grid-cols-3 gap-2'>
                    {commonAmounts.map((value) => (
                      <button
                        key={value}
                        type='button'
                        onClick={() => handleSetAmount(value)}
                        className={`py-2 text-sm rounded-md ${
                          amount === value
                            ? 'bg-primary-100 text-primary-700 border border-primary-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}>
                        {formatCurrency(value)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button
                    type='button'
                    variant='primary'
                    onClick={handleNextStep}>
                    Tiếp tục
                  </Button>
                </div>
              </div>
            )}

            {/* Bước 2: Upload hình ảnh */}
            {step === 'upload' && (
              <div className='space-y-6'>
                <UploadProof
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={proofImage}
                  previewUrl={previewUrl}
                />

                <div className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handlePrevStep}>
                    Quay lại
                  </Button>
                  <Button
                    type='button'
                    variant='primary'
                    onClick={handleNextStep}>
                    Tiếp tục
                  </Button>
                </div>
              </div>
            )}

            {/* Bước 3: Xác nhận */}
            {step === 'confirm' && (
              <div className='space-y-6'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='font-medium text-lg mb-4 flex items-center'>
                    <CreditCard className='h-5 w-5 mr-2 text-primary-500' />
                    Xác nhận thông tin
                  </h4>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                      <span className='text-gray-600'>Số tiền nạp:</span>
                      <span className='font-medium text-primary-700'>
                        {formatCurrency(amount)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                      <span className='text-gray-600'>Người nạp:</span>
                      <span className='font-medium'>
                        {profile?.display_name || profile?.phone}
                      </span>
                    </div>

                    <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                      <span className='text-gray-600'>
                        Bằng chứng giao dịch:
                      </span>
                      <span
                        className='font-medium text-primary-600 underline cursor-pointer'
                        onClick={() => window.open(previewUrl, '_blank')}>
                        Xem hình ảnh
                      </span>
                    </div>

                    <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                      <span className='text-gray-600'>Số dư hiện tại:</span>
                      <span className='font-medium text-green-600'>
                        {formatCurrency(profile?.balance || 0)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-gray-600'>
                        Số dư sau nạp (dự kiến):
                      </span>
                      <span className='font-medium text-green-600'>
                        {formatCurrency((profile?.balance || 0) + amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-blue-50 p-3 rounded-md text-sm text-blue-800'>
                  <div className='flex items-start'>
                    <InfoIcon className='h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5' />
                    <p>
                      Yêu cầu nạp tiền sẽ được xử lý trong vòng 24 giờ. Bạn sẽ
                      nhận được thông báo khi yêu cầu được xử lý.
                    </p>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handlePrevStep}>
                    Quay lại
                  </Button>
                  <Button
                    type='submit'
                    variant='primary'
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    icon={<BanknoteIcon className='h-4 w-4' />}>
                    {isSubmitting ? 'Đang xử lý...' : 'Gửi yêu cầu nạp tiền'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  )
}

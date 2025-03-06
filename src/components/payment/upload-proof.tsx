// src/components/payment/upload-proof.tsx
'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { Camera, Upload, X, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showErrorToast } from '@/components/notifications/notification-helper'

interface UploadProofProps {
  onFileSelect: (file: File, previewUrl: string) => void
  onFileRemove: () => void
  selectedFile: File | null
  previewUrl: string
  maxSize?: number // in MB
  fileTypes?: string[] // array of accepted mime types
  title?: string
  description?: string
}

export function UploadProof({
  onFileSelect,
  onFileRemove,
  selectedFile,
  previewUrl,
  maxSize = 5, // Default 5MB
  fileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  title = 'Tải lên bằng chứng thanh toán',
  description = 'Hình ảnh hóa đơn, màn hình chuyển khoản hoặc bằng chứng thanh toán khác',
}: UploadProofProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset error when file changes
  useEffect(() => {
    if (selectedFile) {
      setError('')
    }
  }, [selectedFile])

  // Handler for file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    processFile(files[0])
  }

  // Handler for drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    processFile(files[0])
  }

  // Process and validate file
  const processFile = (file: File) => {
    setError('')
    setIsLoading(true)

    // Validate file type
    if (!fileTypes.includes(file.type)) {
      setError(
        `Loại file không hợp lệ. Chúng tôi chỉ chấp nhận: ${fileTypes.join(
          ', '
        )}`
      )
      setIsLoading(false)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Kích thước file quá lớn. Tối đa ${maxSize}MB.`)
      setIsLoading(false)
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Wait a moment to simulate processing (can be removed in production)
    setTimeout(() => {
      onFileSelect(file, previewUrl)
      setIsLoading(false)
    }, 500)
  }

  // Click handler for the upload area
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Remove file handler
  const handleRemove = () => {
    onFileRemove()
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-gray-700'>
          {title}
        </label>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            ref={fileInputRef}
            type='file'
            accept={fileTypes.join(',')}
            className='hidden'
            onChange={handleFileChange}
          />

          <div className='flex flex-col items-center justify-center space-y-2'>
            {isLoading ? (
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
            ) : (
              <Upload className='h-12 w-12 text-gray-400' />
            )}
            <div className='text-center'>
              <p className='text-sm font-medium text-gray-700'>
                Kéo thả file vào đây hoặc
                <span className='text-primary-600 hover:text-primary-500'>
                  {' '}
                  click để tải lên
                </span>
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                Hỗ trợ: JPG, PNG, WEBP (Tối đa {maxSize}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='relative border rounded-lg overflow-hidden'>
          <div className='absolute top-2 right-2 z-10'>
            <Button
              variant='icon'
              size='sm'
              onClick={handleRemove}
              className='bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white'>
              <X className='h-4 w-4' />
            </Button>
          </div>

          <div className='aspect-video relative overflow-hidden bg-gray-100'>
            <img
              src={previewUrl}
              alt='Payment proof preview'
              className='object-contain w-full h-full'
              onError={() => {
                showErrorToast('Không thể hiển thị hình ảnh xem trước')
              }}
            />
          </div>

          <div className='p-3 bg-gray-50 border-t flex justify-between items-center'>
            <div className='flex items-center'>
              <Image className='h-4 w-4 text-primary-500 mr-1' />
              <span className='text-sm text-gray-700 truncate max-w-[200px]'>
                {selectedFile.name}
              </span>
            </div>
            <span className='text-xs text-gray-500'>
              {(selectedFile.size / 1024).toFixed(0)} KB
            </span>
          </div>
        </div>
      )}

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <div className='text-sm text-gray-500 bg-gray-50 p-3 rounded'>
        <div className='flex items-start'>
          <FileText className='h-4 w-4 mr-2 text-gray-400 mt-0.5' />
          <ul className='list-disc list-inside space-y-1'>
            <li>Hãy chụp rõ màn hình giao dịch hoặc hóa đơn thanh toán</li>
            <li>
              Đảm bảo thông tin người gửi, người nhận và số tiền được hiển thị
              rõ ràng
            </li>
            <li>Thời gian giao dịch phải được hiển thị</li>
            <li>
              Chúng tôi chỉ chấp nhận file hình ảnh, không chấp nhận file PDF
              hoặc các định dạng khác
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

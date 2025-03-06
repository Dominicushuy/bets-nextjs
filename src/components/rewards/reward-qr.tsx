// src/components/rewards/reward-qr.tsx
'use client'

import { useEffect, useRef } from 'react'

interface RewardQRProps {
  code: string
  size?: number
  className?: string
  includeText?: boolean
  logo?: string
}

export default function RewardQR({
  code,
  size = 200,
  className = '',
  includeText = false,
  logo,
}: RewardQRProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Tạo QR code khi component mount
    if (typeof window !== 'undefined') {
      // Sử dụng dynamic import để tải QRCode.js khi cần thiết
      import('qrcode')
        .then((QRCode) => {
          if (qrContainerRef.current) {
            // Xóa nội dung cũ nếu có
            qrContainerRef.current.innerHTML = ''

            // Tạo canvas element
            const canvas = document.createElement('canvas')
            qrContainerRef.current.appendChild(canvas)

            // Tùy chọn cho QR code
            const options = {
              width: size,
              height: size,
              margin: 1,
              color: {
                dark: '#000000', // Màu đen cho các module QR
                light: '#FFFFFF', // Màu trắng cho background
              },
              errorCorrectionLevel: 'H', // Mức độ sửa lỗi cao nhất
            }

            // Tạo QR code
            QRCode.toCanvas(canvas, code, options, (error) => {
              if (error) console.error('Error generating QR code:', error)

              // Thêm logo vào giữa QR code nếu có
              if (logo && !error) {
                const context = canvas.getContext('2d')
                if (context) {
                  const img = new Image()
                  img.onload = () => {
                    // Tính toán vị trí và kích thước của logo
                    const logoSize = size * 0.2 // Logo chiếm 20% kích thước QR
                    const logoX = (size - logoSize) / 2
                    const logoY = (size - logoSize) / 2

                    // Vẽ hình tròn trắng làm background cho logo
                    context.fillStyle = 'white'
                    context.beginPath()
                    context.arc(
                      size / 2,
                      size / 2,
                      logoSize / 1.8,
                      0,
                      2 * Math.PI
                    )
                    context.fill()

                    // Vẽ logo
                    context.drawImage(img, logoX, logoY, logoSize, logoSize)
                  }
                  img.src = logo
                }
              }
            })
          }
        })
        .catch((err) => {
          console.error('Error loading QRCode library:', err)
        })
    }
  }, [code, size, logo])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={qrContainerRef}
        className='bg-white p-2 rounded-lg shadow-sm'></div>
      {includeText && (
        <div className='mt-2 text-sm text-gray-500 font-mono'>{code}</div>
      )}
    </div>
  )
}

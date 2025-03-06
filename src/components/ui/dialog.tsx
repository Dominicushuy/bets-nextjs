// Một vài UI tweaks cho Dialog component chung nếu cần
// src/components/ui/dialog.tsx (chỉ thêm một số hiệu ứng và animations)

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className = '',
}: DialogProps) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm animation-opacity'>
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 animation-slide-up ${className}`}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none'>
          <X size={20} />
        </button>

        <div className='p-6'>
          {title && (
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          )}
          {description && (
            <p className='mt-2 text-sm text-gray-500'>{description}</p>
          )}
          <div className='mt-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}

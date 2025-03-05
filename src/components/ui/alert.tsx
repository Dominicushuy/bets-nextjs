// src/components/ui/alert.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  title?: string
  children: React.ReactNode
  variant?: AlertVariant
  icon?: React.ReactNode
  onClose?: () => void
  className?: string
}

const alertVariantStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
}

const alertIconVariants: Record<AlertVariant, React.ReactNode> = {
  info: <Info className='h-5 w-5 text-blue-500' />,
  success: <CheckCircle className='h-5 w-5 text-green-500' />,
  warning: <AlertCircle className='h-5 w-5 text-yellow-500' />,
  error: <XCircle className='h-5 w-5 text-red-500' />,
}

export function Alert({
  title,
  children,
  variant = 'info',
  icon,
  onClose,
  className,
}: AlertProps) {
  const iconToRender = icon || alertIconVariants[variant]

  return (
    <div
      className={cn('rounded-md p-4', alertVariantStyles[variant], className)}>
      <div className='flex'>
        <div className='flex-shrink-0'>{iconToRender}</div>
        <div className='ml-3 flex-1'>
          {title && <h3 className='text-sm font-medium'>{title}</h3>}
          <div className={cn('text-sm', title && 'mt-2')}>{children}</div>
        </div>
        {onClose && (
          <div className='ml-auto pl-3'>
            <div className='-mx-1.5 -my-1.5'>
              <button
                type='button'
                onClick={onClose}
                className={cn(
                  'inline-flex rounded-md p-1.5',
                  variant === 'info' &&
                    'bg-blue-50 text-blue-500 hover:bg-blue-100',
                  variant === 'success' &&
                    'bg-green-50 text-green-500 hover:bg-green-100',
                  variant === 'warning' &&
                    'bg-yellow-50 text-yellow-500 hover:bg-yellow-100',
                  variant === 'error' &&
                    'bg-red-50 text-red-500 hover:bg-red-100',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  variant === 'info' && 'focus:ring-blue-500',
                  variant === 'success' && 'focus:ring-green-500',
                  variant === 'warning' && 'focus:ring-yellow-500',
                  variant === 'error' && 'focus:ring-red-500'
                )}>
                <span className='sr-only'>Dismiss</span>
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

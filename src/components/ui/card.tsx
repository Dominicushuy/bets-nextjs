// src/components/ui/card.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  footer?: React.ReactNode
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  headerActions?: React.ReactNode
}

export function Card({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  hoverable = false,
  bordered = true,
  compact = false,
  headerActions,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg overflow-hidden',
        bordered ? 'border border-gray-200' : '',
        hoverable
          ? 'transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1'
          : 'shadow-md',
        className
      )}>
      {/* Card Header */}
      {(title || headerActions) && (
        <div
          className={cn(
            compact ? 'px-4 py-3' : 'px-6 py-4',
            bordered ? 'border-b border-gray-200' : '',
            'flex justify-between items-center',
            headerClassName
          )}>
          <div>
            {title && (
              <h3 className='text-lg font-medium text-gray-800'>{title}</h3>
            )}
            {subtitle && (
              <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>
            )}
          </div>

          {headerActions && (
            <div className='flex items-center space-x-2'>{headerActions}</div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className={cn(compact ? 'p-4' : 'p-6', bodyClassName)}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div
          className={cn(
            compact ? 'px-4 py-3' : 'px-6 py-4',
            bordered ? 'border-t border-gray-200' : '',
            footerClassName
          )}>
          {footer}
        </div>
      )}
    </div>
  )
}

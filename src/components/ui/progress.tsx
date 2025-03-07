// src/components/ui/progress.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value?: number
  max?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
  barClassName?: string
  valueLabel?: string
}

export function Progress({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showValue = false,
  className,
  barClassName,
  valueLabel,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  }

  return (
    <div className='relative'>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200',
          sizeClasses[size],
          className
        )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            colorClasses[color],
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className='mt-1 text-xs text-gray-600 text-right'>
          {valueLabel || `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  )
}

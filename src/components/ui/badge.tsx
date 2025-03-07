import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'destructive'
    | 'outline' // Added outline variant
  size?: 'xs' | 'sm' | 'md'
  rounded?: boolean
  className?: string
  dotIndicator?: boolean
  pulsing?: boolean
  onClick?: () => void
}

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  rounded = false,
  className = '',
  dotIndicator = false,
  pulsing = false,
  onClick = () => {},
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium'

  // Màu sắc cho các biến thể
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    info: 'bg-info-100 text-info-800',
    destructive: 'bg-danger-100 text-danger-800',
    outline: 'bg-transparent text-gray-700 border border-gray-300', // Added outline styling
  }

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
  }

  const roundedClass = rounded ? 'rounded-full' : 'rounded'

  // Màu cho dot indicator
  const dotColorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-success-600',
    danger: 'bg-danger-600',
    warning: 'bg-warning-600',
    info: 'bg-info-600',
    destructive: 'bg-danger-600',
    outline: 'bg-gray-400', // Added dot color for outline variant
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClass,
        className
      )}
      onClick={onClick}>
      {dotIndicator && (
        <span
          className={cn(
            'w-2 h-2 mr-1.5 rounded-full',
            pulsing ? 'animate-pulse' : '',
            dotColorClasses[variant]
          )}></span>
      )}
      {children}
    </span>
  )
}

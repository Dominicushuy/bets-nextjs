// src/components/ui/avatar.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  initials?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  statusClassName?: string
  rounded?: boolean
  bordered?: boolean
  fallback?: string
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  initials,
  status,
  statusClassName = '',
  rounded = true,
  bordered = false,
  fallback,
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  }

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
  }

  const borderClass = bordered ? 'border-2 border-white' : ''
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md'

  const getInitials = () => {
    if (initials) return initials
    if (!alt || alt === 'Avatar') return fallback

    return alt
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className='relative inline-block'>
      {src ? (
        <div
          className={cn(
            sizeClasses[size],
            roundedClass,
            borderClass,
            'overflow-hidden',
            className
          )}>
          <Image
            src={src}
            alt={alt}
            width={64}
            height={64}
            className='object-cover w-full h-full'
          />
        </div>
      ) : (
        <div
          className={cn(
            sizeClasses[size],
            roundedClass,
            borderClass,
            'flex items-center justify-center bg-gray-200 text-gray-600',
            className
          )}>
          {getInitials()}
        </div>
      )}

      {status && (
        <span
          className={cn(
            `absolute bottom-0 right-0 block h-2.5 w-2.5 ${roundedClass}`,
            statusClasses[status],
            borderClass,
            statusClassName
          )}></span>
      )}
    </div>
  )
}

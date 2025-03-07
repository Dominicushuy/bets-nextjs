// src/components/user/level-badge.tsx
'use client'

import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Award } from 'lucide-react'

interface LevelBadgeProps {
  level: number
  levelName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showName?: boolean
  className?: string
}

export default function LevelBadge({
  level,
  levelName,
  size = 'md',
  showIcon = true,
  showName = false,
  className = '',
}: LevelBadgeProps) {
  // Xác định màu sắc và icon dựa trên cấp độ
  const getBadgeColor = (level: number): string => {
    switch (true) {
      case level >= 5:
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400'
      case level >= 4:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400'
      case level >= 3:
        return 'bg-gradient-to-r from-green-600 to-teal-600 border-green-400'
      case level >= 2:
        return 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 border-gray-400'
    }
  }

  // Xác định kích thước dựa trên prop size
  const getBadgeSize = (size: string): string => {
    switch (size) {
      case 'xs':
        return 'px-1.5 py-0.5 text-xs'
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'lg':
        return 'px-3 py-1.5 text-base'
      default: // md
        return 'px-2.5 py-1 text-sm'
    }
  }

  const getIconSize = (size: string): { width: number; height: number } => {
    switch (size) {
      case 'xs':
        return { width: 12, height: 12 }
      case 'sm':
        return { width: 14, height: 14 }
      case 'lg':
        return { width: 20, height: 20 }
      default: // md
        return { width: 16, height: 16 }
    }
  }

  const iconSize = getIconSize(size)
  const badgeColor = getBadgeColor(level)
  const badgeSize = getBadgeSize(size)

  return (
    <Badge
      className={`font-medium ${badgeColor} ${badgeSize} ${
        showName ? 'min-w-20' : ''
      } ${className}`}
      variant='custom'>
      <div className='flex items-center space-x-1'>
        {showIcon && (
          <Award
            width={iconSize.width}
            height={iconSize.height}
            className='text-white'
          />
        )}
        <span>
          {showName && levelName
            ? levelName
            : showName
            ? `Cấp ${level}`
            : `Cấp ${level}`}
        </span>
      </div>
    </Badge>
  )
}

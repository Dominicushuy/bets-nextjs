// src/components/user/LevelBadge.tsx
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Award, Star, Shield, Crown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  className,
}: LevelBadgeProps) {
  // Size classes for the badge
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  // Icon size based on badge size
  const iconSizes = {
    xs: { size: 10 },
    sm: { size: 12 },
    md: { size: 14 },
    lg: { size: 16 },
  }

  // Get the appropriate icon based on level
  const getIcon = () => {
    if (level >= 5) return <Crown {...iconSizes[size]} />
    if (level >= 4) return <Shield {...iconSizes[size]} />
    if (level >= 3) return <Zap {...iconSizes[size]} />
    if (level >= 2) return <Star {...iconSizes[size]} />
    return <Award {...iconSizes[size]} />
  }

  // Get badge styling based on level
  const getBadgeVariant = () => {
    if (level >= 5) return 'warning'
    if (level >= 4) return 'success'
    if (level >= 3) return 'info'
    if (level >= 2) return 'secondary'
    return 'primary'
  }

  return (
    <Badge
      variant={getBadgeVariant()}
      className={cn('flex items-center', sizeClasses[size], className)}>
      {showIcon && <span className='mr-1'>{getIcon()}</span>}
      <span>{showName && levelName ? levelName : `Cấp ${level}`}</span>
    </Badge>
  )
}

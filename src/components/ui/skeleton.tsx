// src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('h-4 w-full animate-pulse rounded bg-gray-200', className)}
    />
  )
}

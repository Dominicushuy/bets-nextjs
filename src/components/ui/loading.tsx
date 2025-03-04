// src/components/ui/loading.tsx
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className='flex justify-center items-center p-4'>
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-primary-500',
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}

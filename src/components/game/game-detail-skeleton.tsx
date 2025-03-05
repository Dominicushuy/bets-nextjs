// src/components/game/game-detail-skeleton.tsx
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function GameDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-8 w-72 mt-2' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Game details skeleton */}
        <Card className='lg:col-span-1'>
          <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <Skeleton className='h-6 w-40' />
              <Skeleton className='h-6 w-24' />
            </div>

            <div className='space-y-4'>
              <div>
                <Skeleton className='h-4 w-24 mb-1' />
                <Skeleton className='h-8 w-full' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className='h-4 w-24 mb-1' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ))}
              </div>

              <div className='mt-4'>
                <Skeleton className='h-4 w-32 mb-1' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
          </div>
        </Card>

        {/* Betting form skeleton */}
        <Card className='lg:col-span-2'>
          <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-6 w-32' />
            </div>

            <div className='space-y-4'>
              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <div className='flex flex-wrap gap-2 mb-3'>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className='h-10 w-16' />
                  ))}
                </div>
                <Skeleton className='h-12 w-full' />
              </div>

              <div>
                <Skeleton className='h-4 w-20 mb-2' />
                <div className='flex flex-wrap gap-2 mb-3'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-8 w-24' />
                  ))}
                </div>
                <div className='flex space-x-2'>
                  <Skeleton className='h-12 w-12' />
                  <Skeleton className='h-12 flex-1' />
                  <Skeleton className='h-12 w-12' />
                </div>
              </div>

              <Skeleton className='h-16 w-full mt-4' />
            </div>
          </div>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* User Bets skeleton */}
        <Card>
          <div className='p-4'>
            <Skeleton className='h-6 w-48 mb-4' />
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          </div>
        </Card>

        {/* All Users Bets skeleton */}
        <Card className='lg:col-span-2'>
          <div className='p-4'>
            <Skeleton className='h-6 w-56 mb-4' />
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

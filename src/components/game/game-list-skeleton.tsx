// src/components/game/game-list-skeleton.tsx
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function GameListSkeleton() {
  return (
    <Card className='p-6'>
      <div className='overflow-x-auto'>
        <div className='mb-4'>
          <Skeleton className='h-8 w-48' />
        </div>

        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className='px-4 py-3'>
                  <Skeleton className='h-4 w-20' />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} className='px-4 py-4'>
                    <Skeleton className={`h-5 w-${j === 4 ? '24' : '32'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

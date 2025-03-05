// src/components/dashboard/featured-games.tsx
'use client'

import { useGameRoundsRealtime } from '@/hooks/game-hooks'
import { Loading } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import GameCard from '@/components/game/game-card'
import Link from 'next/link'

export default function FeaturedGames() {
  const { data: activeGamesData, isLoading } = useGameRoundsRealtime(
    'active',
    1,
    3
  ) // Lấy 3 lượt chơi đang diễn ra

  if (isLoading) {
    return <Loading />
  }

  const activeGames = activeGamesData?.data || []

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Lượt chơi nổi bật</h2>
        <Link href='/games'>
          <Button variant='outline' size='sm'>
            Xem tất cả
          </Button>
        </Link>
      </div>

      {activeGames.length === 0 ? (
        <div className='text-center py-8 bg-gray-50 rounded-lg'>
          <p className='text-gray-500'>Không có lượt chơi nào đang diễn ra</p>
          <Link href='/games'>
            <Button variant='primary' size='sm' className='mt-4'>
              Khám phá tất cả lượt chơi
            </Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {activeGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}

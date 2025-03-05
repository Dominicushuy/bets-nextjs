// src/components/game/game-card.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GameRound } from '@/types/database'

interface GameCardProps {
  game: GameRound
  showActions?: boolean
}

export default function GameCard({ game, showActions = true }: GameCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant='warning'>Chờ bắt đầu</Badge>
      case 'active':
        return (
          <Badge variant='success' dotIndicator pulsing>
            Đang diễn ra
          </Badge>
        )
      case 'completed':
        return <Badge variant='primary'>Đã hoàn thành</Badge>
      case 'cancelled':
        return <Badge variant='destructive'>Đã hủy</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow duration-300'>
      <div className='p-5'>
        <div className='flex justify-between items-start mb-3'>
          <div className='flex flex-col'>
            <span className='text-gray-500 text-sm'>ID lượt chơi</span>
            <span className='font-mono text-sm'>
              {game.id.substring(0, 8)}...
            </span>
          </div>
          {getStatusBadge(game.status)}
        </div>

        <div className='grid grid-cols-2 gap-4 my-4'>
          <div>
            <span className='text-gray-500 text-sm'>Bắt đầu</span>
            <div className='font-medium'>
              {new Date(game.start_time).toLocaleString('vi-VN')}
            </div>
          </div>

          {game.end_time && (
            <div>
              <span className='text-gray-500 text-sm'>Kết thúc</span>
              <div className='font-medium'>
                {new Date(game.end_time).toLocaleString('vi-VN')}
              </div>
            </div>
          )}

          <div>
            <span className='text-gray-500 text-sm'>Tổng tiền cược</span>
            <div className='font-medium text-primary-600'>
              {game.total_bets?.toLocaleString() || 0} VND
            </div>
          </div>

          {game.status === 'completed' && (
            <div>
              <span className='text-gray-500 text-sm'>Số trúng</span>
              <div className='font-bold text-success-600'>
                {game.winning_number || '-'}
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className='mt-4'>
            <Link href={`/games/${game.id}`}>
              <Button
                variant={game.status === 'active' ? 'primary' : 'outline'}
                className='w-full'>
                {game.status === 'active' ? 'Đặt cược' : 'Xem chi tiết'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}

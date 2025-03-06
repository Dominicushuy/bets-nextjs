'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { GameRound } from '@/types/database'
import { useCompleteGameRound } from '@/hooks/game-hooks'
import { toast } from 'react-hot-toast'
import { PlayCircle, PauseCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminGameControlProps {
  game: GameRound
}

export default function AdminGameControl({ game }: AdminGameControlProps) {
  const router = useRouter()
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [winningNumber, setWinningNumber] = useState('')

  const { mutate: completeGame, isPending } = useCompleteGameRound()

  const handleCompleteGame = () => {
    if (!winningNumber) {
      toast.error('Vui lòng nhập số trúng thưởng')
      return
    }

    completeGame(
      {
        gameId: game.id,
        winningNumber,
      },
      {
        onSuccess: () => {
          toast.success(`Lượt chơi đã kết thúc với số trúng: ${winningNumber}`)
          setCompleteDialogOpen(false)
          router.refresh()
        },
        onError: (error: any) => {
          toast.error(`Lỗi khi kết thúc lượt chơi: ${error.message}`)
        },
      }
    )
  }

  if (game.status !== 'active') {
    return null
  }

  return (
    <>
      <Card className='bg-white border-primary-500 border-2'>
        <div className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <PlayCircle className='text-primary-500 h-6 w-6 mr-2' />
              <h3 className='font-medium text-primary-700'>
                Admin Control Panel
              </h3>
            </div>
            <Button
              variant='success'
              onClick={() => setCompleteDialogOpen(true)}
              className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Kết thúc lượt chơi
            </Button>
          </div>
        </div>
      </Card>

      {/* Complete Game Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        title='Kết thúc lượt chơi'
        description='Nhập số trúng thưởng để kết thúc lượt chơi và tính toán kết quả.'>
        <div className='space-y-4 my-4'>
          <div>
            <label
              htmlFor='winningNumber'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Số trúng thưởng
            </label>
            <input
              type='text'
              id='winningNumber'
              value={winningNumber}
              onChange={(e) => setWinningNumber(e.target.value)}
              placeholder='Nhập số trúng (ví dụ: 88)'
              className='block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => setCompleteDialogOpen(false)}
            disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant='success'
            onClick={handleCompleteGame}
            loading={isPending}
            disabled={isPending || !winningNumber}>
            Hoàn thành lượt chơi
          </Button>
        </div>
      </Dialog>
    </>
  )
}

// src/components/admin/games/admin-game-control.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useCompleteGameRound } from '@/hooks/game-hooks'
import { GameRound } from '@/types/database'

interface AdminGameControlProps {
  game: GameRound
}

export default function AdminGameControl({ game }: AdminGameControlProps) {
  const router = useRouter()
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState('')
  const [error, setError] = useState('')

  const { mutate: completeGame, isPending } = useCompleteGameRound()

  const handleComplete = () => {
    setError('')

    if (!selectedNumber) {
      setError('Vui lòng nhập số trúng thưởng')
      return
    }

    completeGame(
      { gameId: game.id, winningNumber: selectedNumber },
      {
        onSuccess: () => {
          setCompleteDialogOpen(false)
          router.refresh()
        },
      }
    )
  }

  // Tạo danh sách số phổ biến để chọn
  const commonNumbers = ['1', '2', '3', '7', '8', '9', '66', '68', '88', '99']

  return (
    <Card>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium'>Quản lý lượt chơi (Admin)</h3>
          <Badge variant={game.status === 'active' ? 'success' : 'secondary'}>
            {game.status}
          </Badge>
        </div>

        <div className='space-y-4'>
          {game.status === 'active' && (
            <Button
              variant='primary'
              className='w-full'
              onClick={() => setCompleteDialogOpen(true)}>
              Kết thúc lượt chơi
            </Button>
          )}

          {game.status === 'completed' && (
            <div className='bg-green-50 p-4 rounded-lg text-center'>
              <p className='text-green-700'>Lượt chơi đã hoàn thành</p>
              <p className='text-xl font-bold mt-1'>
                Số trúng: {game.winning_number}
              </p>
            </div>
          )}

          <Button
            variant='outline'
            className='w-full'
            onClick={() => router.push('/admin/games')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>

      {/* Dialog kết thúc lượt chơi */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        title='Kết thúc lượt chơi'
        description='Chọn số trúng thưởng để kết thúc lượt chơi này.'>
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Số trúng thưởng
            </label>
            <div className='flex flex-wrap gap-2 mb-3'>
              {commonNumbers.map((num) => (
                <button
                  key={num}
                  type='button'
                  onClick={() => setSelectedNumber(num)}
                  className={`px-4 py-2 rounded-md ${
                    selectedNumber === num
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                  {num}
                </button>
              ))}
            </div>
            <input
              type='text'
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              className='w-full px-4 py-3 text-lg text-center border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium'
              placeholder='Nhập số trúng thưởng'
            />
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <p className='text-yellow-800 text-sm'>
              <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Số trúng
              thưởng sẽ được sử dụng để xác định người thắng và phân phối phần
              thưởng.
            </p>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='secondary'
            onClick={() => setCompleteDialogOpen(false)}
            disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant='primary'
            onClick={handleComplete}
            loading={isPending}>
            Xác nhận kết thúc
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}

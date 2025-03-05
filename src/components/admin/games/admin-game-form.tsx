'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  useCreateGameRound,
  useUpdateGameRound,
  useGameRound,
} from '@/hooks/game-hooks'
import Link from 'next/link'

interface AdminGameFormProps {
  userId: string
  gameId?: string
}

export default function AdminGameForm({ userId, gameId }: AdminGameFormProps) {
  const router = useRouter()
  const [startTime, setStartTime] = useState<string>('')
  const [status, setStatus] = useState<'pending' | 'active'>('pending')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Hook để tạo game mới
  const { mutate: createGame, isPending: isCreating } = useCreateGameRound()

  // Hook để cập nhật game
  const { mutate: updateGame, isPending: isUpdating } = useUpdateGameRound()

  // Hook để lấy thông tin game (nếu là chỉnh sửa)
  const { data: gameData, isLoading: isLoadingGame } = useGameRound(
    gameId || ''
  )

  // Form đang xử lý hay không
  const isProcessing = isCreating || isUpdating || isLoading

  // Lấy thông tin game cần sửa
  useEffect(() => {
    if (gameId && gameData) {
      const game = gameData
      setStartTime(new Date(game.start_time).toISOString().slice(0, 16))
      setStatus(game.status as 'pending' | 'active')
    } else if (!gameId) {
      // Nếu là tạo mới, set thời gian mặc định là 5 phút sau
      const defaultTime = new Date()
      defaultTime.setMinutes(defaultTime.getMinutes() + 5)
      setStartTime(defaultTime.toISOString().slice(0, 16))
    }
  }, [gameId, gameData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const startDate = new Date(startTime)

      if (isNaN(startDate.getTime())) {
        setError('Thời gian bắt đầu không hợp lệ')
        return
      }

      // Nếu là chỉnh sửa
      if (gameId) {
        updateGame(
          {
            gameId,
            data: {
              start_time: startDate.toISOString(),
              status,
            },
          },
          {
            onSuccess: () => {
              router.push('/admin/games')
            },
            onError: (error: any) => {
              setError(error.message || 'Lỗi khi cập nhật lượt chơi')
            },
          }
        )
      }
      // Nếu là tạo mới
      else {
        createGame(
          {
            created_by: userId,
            start_time: startDate.toISOString(),
            status,
          },
          {
            onSuccess: () => {
              router.push('/admin/games')
            },
            onError: (error: any) => {
              setError(error.message || 'Lỗi khi tạo lượt chơi mới')
            },
          }
        )
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  if (gameId && isLoadingGame) {
    return (
      <Card>
        <div className='p-6'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-1/4 mb-4'></div>
            <div className='h-10 bg-gray-200 rounded w-full mb-4'></div>
            <div className='h-10 bg-gray-200 rounded w-full mb-4'></div>
            <div className='h-10 bg-gray-200 rounded w-1/2 mx-auto'></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className='p-6'>
        {error && (
          <div className='p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
            {error}
          </div>
        )}

        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Thời gian bắt đầu
            </label>
            <input
              type='datetime-local'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              required
            />
            <p className='mt-1 text-sm text-gray-500'>
              {`Lượt chơi sẽ tự động chuyển sang trạng thái "Đang diễn ra" khi đến
              thời gian bắt đầu`}
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'pending' | 'active')
              }
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              required>
              <option value='pending'>Chờ bắt đầu</option>
              <option value='active'>Đang diễn ra</option>
            </select>
          </div>

          <div className='flex justify-end space-x-4 pt-4'>
            <Link href='/admin/games'>
              <Button variant='secondary' type='button' disabled={isProcessing}>
                Hủy
              </Button>
            </Link>
            <Button variant='primary' type='submit' loading={isProcessing}>
              {gameId ? 'Cập nhật' : 'Tạo lượt chơi'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}

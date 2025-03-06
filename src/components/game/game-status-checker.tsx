// src/components/game/game-status-checker.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, PlayCircle, CheckCircle, XCircle } from 'lucide-react'

interface GameStatusCheckerProps {
  gameId: string
  currentStatus: string
  showStatus?: boolean
}

export default function GameStatusChecker({
  gameId,
  currentStatus,
  showStatus = false,
}: GameStatusCheckerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [statusChanged, setStatusChanged] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='warning' className='inline-flex items-center'>
            <PlayCircle className='mr-1 h-3 w-3' />
            Chờ bắt đầu
          </Badge>
        )
      case 'active':
        return (
          <Badge variant='success' className='inline-flex items-center'>
            <PlayCircle className='mr-1 h-3 w-3' />
            Đang diễn ra
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant='primary' className='inline-flex items-center'>
            <CheckCircle className='mr-1 h-3 w-3' />
            Đã hoàn thành
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant='destructive' className='inline-flex items-center'>
            <XCircle className='mr-1 h-3 w-3' />
            Đã hủy
          </Badge>
        )
      default:
        return (
          <Badge variant='secondary' className='inline-flex items-center'>
            <AlertCircle className='mr-1 h-3 w-3' />
            {status}
          </Badge>
        )
    }
  }

  useEffect(() => {
    // If game was initially not completed, listen for status changes
    if (currentStatus !== 'completed') {
      const subscription = supabase
        .channel(`game_status_${gameId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_rounds',
            filter: `id=eq.${gameId}`,
          },
          (payload) => {
            // Check if status changed
            if (payload.new.status !== status) {
              setStatus(payload.new.status)
              setStatusChanged(true)

              // Invalidate query cache
              queryClient.invalidateQueries({
                queryKey: ['games', 'detail', gameId],
              })

              // Show toast notification
              if (payload.new.status === 'completed') {
                toast.success('Lượt chơi đã kết thúc! Đang tải kết quả...', {
                  duration: 5000,
                  icon: '🎮',
                })

                // Refresh the page after a short delay to show the results
                setTimeout(() => {
                  router.refresh()
                }, 2000)
              } else if (payload.new.status === 'cancelled') {
                toast.error('Lượt chơi đã bị hủy.', {
                  duration: 5000,
                  icon: '❌',
                })
              } else if (
                payload.new.status === 'active' &&
                currentStatus === 'pending'
              ) {
                toast.success(
                  'Lượt chơi đã bắt đầu! Bạn có thể đặt cược ngay bây giờ.',
                  {
                    duration: 5000,
                    icon: '🎲',
                  }
                )
              }
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [gameId, currentStatus, queryClient, router, status])

  // This is a hidden component that just handles status changes by default
  if (!showStatus) return null

  // Or display status badge if showStatus is true
  return <div className='inline-block'>{getStatusBadge()}</div>
}

// src/components/game/game-status-checker.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

interface GameStatusCheckerProps {
  gameId: string
  currentStatus: string
}

export default function GameStatusChecker({
  gameId,
  currentStatus,
}: GameStatusCheckerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [statusChanged, setStatusChanged] = useState(false)

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
            if (payload.new.status !== currentStatus) {
              setStatusChanged(true)

              // Invalidate query cache
              queryClient.invalidateQueries({
                queryKey: ['games', 'detail', gameId],
              })

              // Show toast notification
              if (payload.new.status === 'completed') {
                toast.success('Lượt chơi đã kết thúc! Đang tải kết quả...', {
                  duration: 5000,
                })

                // Refresh the page after a short delay to show the results
                setTimeout(() => {
                  router.refresh()
                }, 2000)
              } else if (payload.new.status === 'cancelled') {
                toast.error('Lượt chơi đã bị hủy.', { duration: 5000 })
              }
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [gameId, currentStatus, queryClient, router])

  // This is a hidden component that just handles status changes
  return null
}

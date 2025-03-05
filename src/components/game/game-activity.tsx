// src/components/game/game-activity.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Bet } from '@/types/database'

interface GameActivityProps {
  gameId: string
  className?: string
}

export default function GameActivity({
  gameId,
  className = '',
}: GameActivityProps) {
  const [recentBets, setRecentBets] = useState<Bet[]>([])
  const [showAnimation, setShowAnimation] = useState<Record<string, boolean>>(
    {}
  )

  // Initial fetch
  useEffect(() => {
    const fetchRecentBets = async () => {
      const { data } = await supabase
        .from('bets')
        .select(
          `
          *,
          user:user_id (
            phone
          )
        `
        )
        .eq('game_round_id', gameId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        setRecentBets(data as Bet[])
      }
    }

    fetchRecentBets()
  }, [gameId])

  // Subscribe to real-time changes
  useEffect(() => {
    const subscription = supabase
      .channel(`public:bets:game_round_id=eq.${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bets',
          filter: `game_round_id=eq.${gameId}`,
        },
        async (payload) => {
          // Fetch complete bet information with user
          const { data } = await supabase
            .from('bets')
            .select(
              `
              *,
              user:user_id (
                phone
              )
            `
            )
            .eq('id', payload.new.id)
            .single()

          if (data) {
            // Add animation flag for this bet
            setShowAnimation((prev) => ({ ...prev, [data.id]: true }))

            // Add to recent bets list (at the top)
            setRecentBets((prev) => [data as Bet, ...prev.slice(0, 4)])

            // Remove animation flag after 3 seconds
            setTimeout(() => {
              setShowAnimation((prev) => ({ ...prev, [data.id]: false }))
            }, 3000)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [gameId])

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className='text-lg font-medium mb-4'>Hoạt động mới nhất</h3>

      <div className='space-y-2 max-h-80 overflow-y-auto'>
        {recentBets.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            Chưa có hoạt động nào
          </p>
        ) : (
          recentBets.map((bet) => (
            <div
              key={bet.id}
              className={`p-3 border rounded-lg transition-all duration-500 ${
                showAnimation[bet.id]
                  ? 'border-primary-300 bg-primary-50 shadow-md transform -translate-y-1'
                  : 'border-gray-200'
              }`}>
              <div className='flex justify-between'>
                <div>
                  <div className='font-medium'>
                    {bet.user?.phone
                      ? `${bet.user.phone.substring(
                          0,
                          4
                        )}****${bet.user.phone.substring(
                          bet.user.phone.length - 3
                        )}`
                      : 'Ẩn danh'}
                  </div>
                  <div className='text-sm text-gray-500'>
                    đặt cược số{' '}
                    <span className='font-medium'>{bet.selected_number}</span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-primary-600'>
                    {formatCurrency(bet.amount)}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {new Date(bet.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

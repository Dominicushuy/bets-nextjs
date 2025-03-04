import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { GameRound, Bet } from '@/types/database'

// Keys for React Query caching
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (filters: any) => [...gameKeys.lists(), { filters }] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
  bets: (gameId: string) => [...gameKeys.detail(gameId), 'bets'] as const,
  userBets: (userId: string) => ['bets', { userId }] as const,
}

/**
 * Hook để lấy danh sách các game rounds
 */
export const useGameRounds = (
  status?: 'pending' | 'active' | 'completed' | 'cancelled'
) => {
  return useQuery({
    queryKey: gameKeys.list({ status }),
    queryFn: async () => {
      let query = supabase
        .from('game_rounds')
        .select(
          `
          *,
          creator:created_by (phone)
        `
        )
        .order('start_time', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as GameRound[]
    },
  })
}

/**
 * Hook để lấy chi tiết game round
 */
export const useGameRound = (gameId: string) => {
  return useQuery({
    queryKey: gameKeys.detail(gameId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_rounds')
        .select(
          `
          *,
          creator:created_by (phone)
        `
        )
        .eq('id', gameId)
        .single()

      if (error) throw error
      return data as GameRound
    },
    enabled: !!gameId,
  })
}

/**
 * Hook để lấy bets của một game round
 */
export const useGameBets = (gameId: string) => {
  return useQuery({
    queryKey: gameKeys.bets(gameId),
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) throw error
      return data as Bet[]
    },
    enabled: !!gameId,
  })
}

/**
 * Hook để lấy bets của một user
 */
export const useUserBets = (userId: string) => {
  return useQuery({
    queryKey: gameKeys.userBets(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bets')
        .select(
          `
          *,
          game:game_round_id (
            id,
            status,
            winning_number,
            start_time,
            end_time
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Bet[]
    },
    enabled: !!userId,
  })
}

/**
 * Hook để tạo bet mới
 */
export const usePlaceBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      gameRoundId,
      selectedNumber,
      amount,
    }: {
      userId: string
      gameRoundId: string
      selectedNumber: string
      amount: number
    }) => {
      // Sử dụng Next.js API thay vì trực tiếp gọi Supabase function
      const response = await fetch('/api/game-rounds/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameRoundId,
          selectedNumber,
          amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error placing bet')
      }

      const data = await response.json()
      return data
    },
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({
        queryKey: gameKeys.bets(variables.gameRoundId),
      })
      queryClient.invalidateQueries({
        queryKey: gameKeys.userBets(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: gameKeys.detail(variables.gameRoundId),
      })
      toast.success('Đặt cược thành công!')
    },
    onError: (error: any) => {
      console.error('Error placing bet:', error)
      toast.error(error.message || 'Không thể đặt cược. Vui lòng thử lại.')
    },
  })
}

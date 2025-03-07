// src/hooks/game-hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { GameRound, Bet } from '@/types/database'
import { useEffect, useState } from 'react'
import {
  showSuccessToast,
  showErrorToast,
} from '@/components/notifications/notification-helper'
import confetti from 'canvas-confetti'

// Keys cho React Query caching
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
  status?: 'pending' | 'active' | 'completed' | 'cancelled',
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: gameKeys.list({ status, page, limit }),
    queryFn: async () => {
      let query = supabase
        .from('game_rounds')
        .select(
          `
          *,
          creator:created_by (phone)
        `,
          { count: 'exact' }
        )
        .order('start_time', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as GameRound[],
        pagination: {
          page,
          limit,
          totalRecords: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }
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
      return data
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy danh sách các game rounds với real-time updates
 */
export const useGameRoundsRealtime = (
  status?: 'pending' | 'active' | 'completed' | 'cancelled',
  page = 1,
  limit = 10
) => {
  const queryClient = useQueryClient()

  // Query để lấy dữ liệu ban đầu
  const query = useQuery({
    queryKey: gameKeys.list({ status, page, limit }),
    queryFn: async () => {
      let query = supabase
        .from('game_rounds')
        .select(
          `
          *,
          creator:created_by (phone)
        `,
          { count: 'exact' }
        )
        .order('start_time', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as GameRound[],
        pagination: {
          page,
          limit,
          totalRecords: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }
    },
  })

  // Thiết lập real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('game_rounds_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rounds',
          filter: status ? `status=eq.${status}` : undefined,
        },
        (payload) => {
          // Khi có thay đổi, cập nhật cache
          queryClient.invalidateQueries({
            queryKey: gameKeys.list({ status, page, limit }),
          })
        }
      )
      .subscribe()

    // Cleanup subscription khi component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, status, page, limit])

  return query
}

/**
 * Hook để lấy chi tiết game round với các bets và thông tin liên quan
 */
export const useGameRoundDetails = (gameId: string, userId: string) => {
  return useQuery({
    queryKey: [...gameKeys.detail(gameId), 'details', userId],
    queryFn: async () => {
      const response = await fetch(`/api/game-rounds/${gameId}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error fetching game round details')
      }

      return await response.json()
    },
    enabled: !!gameId && !!userId,
  })
}

/**
 * Hook để đặt cược
 */
export const usePlaceBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      gameRoundId,
      selectedNumber,
      amount,
    }: {
      gameRoundId: string
      selectedNumber: string
      amount: number
    }) => {
      // Thêm validation ở client
      if (!selectedNumber || selectedNumber.trim() === '') {
        throw new Error('Vui lòng chọn số để đặt cược')
      }

      if (!/^\d+$/.test(selectedNumber)) {
        throw new Error('Số cược phải là số nguyên dương')
      }

      if (!amount || amount < 10000) {
        throw new Error('Số tiền cược tối thiểu là 10,000 VND')
      }

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

      return await response.json()
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['games', 'detail', variables.gameRoundId],
      })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([
        'games',
        'detail',
        variables.gameRoundId,
        'details',
      ])

      // Optimistically update the user balance and add the new bet
      queryClient.setQueryData(
        ['games', 'detail', variables.gameRoundId, 'details'],
        (old: any) => {
          if (!old) return old

          // Create a new bet object
          const newBet = {
            id: `temp-${Date.now()}`,
            user_id: 'current-user',
            game_round_id: variables.gameRoundId,
            selected_number: variables.selectedNumber,
            amount: variables.amount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_winner: null,
          }

          // Add to user bets and all bets
          return {
            ...old,
            userBets: [newBet, ...(old.userBets || [])],
            bets: [{ ...newBet, user: { phone: 'Bạn' } }, ...(old.bets || [])],
            userBalance: Math.max(0, (old.userBalance || 0) - variables.amount),
          }
        }
      )

      // Also update the user profile
      queryClient.setQueryData(
        ['profiles', 'detail', 'current-user'],
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            balance: Math.max(0, (old.balance || 0) - variables.amount),
          }
        }
      )

      return { previousData }
    },
    onSuccess: (data, variables) => {
      // Update query cache for game details
      queryClient.invalidateQueries({
        queryKey: ['games', 'detail', variables.gameRoundId, 'details'],
      })

      // Update user profile to reflect new balance
      queryClient.invalidateQueries({
        queryKey: ['profiles'],
      })

      // Update bet history
      queryClient.invalidateQueries({
        queryKey: ['bets', { userId: 'current-user' }],
      })

      showSuccessToast('Đặt cược thành công!')
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(
          ['games', 'detail', variables.gameRoundId, 'details'],
          context.previousData
        )
      }

      showErrorToast(err.message || 'Không thể đặt cược. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để theo dõi real-time updates cho một game round
 */
export const useGameRoundRealtime = (gameId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!gameId) return

    // Subscribe to changes on game_rounds table
    const gameSubscription = supabase
      .channel(`game_round_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rounds',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: gameKeys.detail(gameId) })
        }
      )
      .subscribe()

    // Subscribe to changes on bets table for this game
    const betsSubscription = supabase
      .channel(`bets_for_game_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets',
          filter: `game_round_id=eq.${gameId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: gameKeys.bets(gameId) })
          queryClient.invalidateQueries({
            queryKey: [...gameKeys.detail(gameId), 'details'],
          })
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      gameSubscription.unsubscribe()
      betsSubscription.unsubscribe()
    }
  }, [gameId, queryClient])
}

/**
 * Hook để kết thúc lượt chơi (Admin only)
 */
export const useCompleteGameRound = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      gameId,
      winningNumber,
    }: {
      gameId: string
      winningNumber: string
    }) => {
      const response = await fetch(`/api/game-rounds/${gameId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winningNumber }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error completing game round')
      }

      return await response.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: gameKeys.detail(variables.gameId),
      })
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: [...gameKeys.all, 'results'],
      })
      toast.success('Lượt chơi đã được hoàn thành!')
    },
    onError: (error: any) => {
      console.error('Error completing game round:', error)
      toast.error(
        error.message || 'Không thể hoàn thành lượt chơi. Vui lòng thử lại.'
      )
    },
  })
}

/**
 * Hook để lấy kết quả chi tiết của một lượt chơi
 */
export const useGameRoundResults = (gameId: string) => {
  const queryClient = useQueryClient()

  const { data, isSuccess, ...rest } = useQuery({
    queryKey: [...gameKeys.detail(gameId), 'results'],
    queryFn: async () => {
      const response = await fetch(`/api/game-rounds/${gameId}/results`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch game results')
      }

      // Cập nhật cache cho kết quả trò chơi
      const data = await response.json()

      // Invalidate các query liên quan đến thông báo vì chúng đã được đánh dấu là đã đọc
      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      return data
    },
    enabled: !!gameId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (isSuccess && data?.isWinner) {
      // Cập nhật cache cho game round
      queryClient.setQueryData([...gameKeys.detail(gameId)], data.gameRound)

      // Cập nhật cache cho profile (số dư) nếu là winner
      if (data.isWinner) {
        const user = queryClient.getQueryData<{ id: string }>(['auth', 'user'])
        const userId = user?.id
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: ['profiles', 'detail', userId],
          })
        }
      }
    }
  }, [isSuccess, data, gameId, queryClient])

  return {
    data,
    ...rest,
  }
}

/**
 * Hook để tạo lượt chơi mới (Admin only)
 */
export const useCreateGameRound = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<GameRound>) => {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error creating game round')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
      toast.success('Tạo lượt chơi mới thành công!')
    },
    onError: (error: any) => {
      console.error('Error creating game round:', error)
      toast.error(error.message || 'Không thể tạo lượt chơi. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để cập nhật lượt chơi (Admin only)
 */
export const useUpdateGameRound = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      gameId,
      data,
    }: {
      gameId: string
      data: Partial<GameRound>
    }) => {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error updating game round')
      }

      return await response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: gameKeys.detail(variables.gameId),
      })
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
      toast.success('Cập nhật lượt chơi thành công!')
    },
    onError: (error: any) => {
      console.error('Error updating game round:', error)
      toast.error(
        error.message || 'Không thể cập nhật lượt chơi. Vui lòng thử lại.'
      )
    },
  })
}

/**
 * Hook để xóa lượt chơi (Admin only)
 */
export const useDeleteGameRound = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (gameId: string) => {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error deleting game round')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
      toast.success('Xóa lượt chơi thành công!')
    },
    onError: (error: any) => {
      console.error('Error deleting game round:', error)
      toast.error(error.message || 'Không thể xóa lượt chơi. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để theo dõi trạng thái game theo thời gian thực
 * Kết hợp data từ API và subscription
 */
export function useGameRoundRealtimeStatus(gameId: string) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<string | null>(null)
  const [winningNumber, setWinningNumber] = useState<string | null>(null)

  // Fetch initial data
  const { data: gameData } = useGameRound(gameId)

  // Set initial status
  useEffect(() => {
    if (gameData) {
      setStatus(gameData.status)
      setWinningNumber(gameData.winning_number)
    }
  }, [gameData])

  // Set up subscription
  useEffect(() => {
    if (!gameId) return

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
          // Update local state
          if (payload.new.status !== status) {
            setStatus(payload.new.status)
          }

          if (payload.new.winning_number !== winningNumber) {
            setWinningNumber(payload.new.winning_number)
          }

          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: gameKeys.detail(gameId) })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [gameId, queryClient, status, winningNumber])

  return {
    status,
    winningNumber,
    isCompleted: status === 'completed',
    isPending: status === 'pending',
    isActive: status === 'active',
    isCancelled: status === 'cancelled',
  }
}

// Bổ sung hook để lấy phân phối số lượng đặt cược
export function useGameNumberDistribution(gameId: string) {
  return useQuery({
    queryKey: ['games', 'number-distribution', gameId],
    queryFn: async () => {
      const response = await fetch(
        `/api/game-rounds/${gameId}/number-distribution`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch number distribution')
      }
      return await response.json()
    },
    enabled: !!gameId,
    staleTime: 30 * 1000, // 30 giây
  })
}

/**
 * Hook để lấy thống kê cược của một game
 */
export function useBetStats(gameId: string) {
  return useQuery({
    queryKey: ['games', 'bet-stats', gameId],
    queryFn: async () => {
      const response = await fetch(`/api/game-rounds/${gameId}/bet-stats`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch bet stats')
      }
      return await response.json()
    },
    enabled: !!gameId,
    staleTime: 30 * 1000, // 30 giây
  })
}

/**
 * Hook để kiểm tra nhanh xem người dùng có thắng trong một lượt chơi cụ thể
 */
export function useWinCheck(gameId: string, userId: string) {
  return useQuery({
    queryKey: ['win-check', gameId, userId],
    queryFn: async () => {
      const { data: userBets, error } = await supabase
        .from('bets')
        .select('*')
        .eq('game_round_id', gameId)
        .eq('user_id', userId)
        .eq('is_winner', true)

      if (error) throw error

      const isWinner = userBets && userBets.length > 0
      let totalWinAmount = 0

      if (isWinner) {
        totalWinAmount = userBets.reduce((sum, bet) => sum + bet.amount * 80, 0)
      }

      return {
        isWinner,
        totalWinAmount,
        winningBets: userBets || [],
      }
    },
    enabled: !!gameId && !!userId,
  })
}

/**
 * Hook để quản lý hiệu ứng confetti
 */
export function useConfetti() {
  const smallConfettiEffect = (duration = 3000) => {
    const end = Date.now() + duration

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF0000', '#90EE90', '#1E90FF'],
      })

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF0000', '#90EE90', '#1E90FF'],
      })
    }, 150)

    return () => clearInterval(interval)
  }

  const bigConfettiEffect = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        '#FFD700',
        '#FFA500',
        '#FF4500',
        '#FF6347',
        '#FF0000',
        '#90EE90',
        '#1E90FF',
      ],
      shapes: ['circle', 'square'],
      scalar: 1.2,
    })
  }

  const winnerConfettiEffect = () => {
    // Hiệu ứng nhỏ liên tục
    const cleanup = smallConfettiEffect(3000)

    // Hiệu ứng lớn sau 1 giây
    setTimeout(() => {
      bigConfettiEffect()
    }, 1000)

    // Hiệu ứng lớn thứ 2 sau 2 giây
    setTimeout(() => {
      bigConfettiEffect()
    }, 2000)

    return cleanup
  }

  const fireworksEffect = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FF0000', '#FF4500'],
        })
      )

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#00FF00', '#0000FF', '#FF00FF'],
        })
      )
    }, 250)

    return () => clearInterval(interval)
  }

  return {
    smallConfettiEffect,
    bigConfettiEffect,
    winnerConfettiEffect,
    fireworksEffect,
  }
}

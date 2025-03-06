// src/hooks/reward-hooks.ts - Cập nhật
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { RewardCode } from '@/types/database'

// Keys for React Query caching
export const rewardKeys = {
  all: ['rewards'] as const,
  lists: () => [...rewardKeys.all, 'list'] as const,
  list: (filters: any) => [...rewardKeys.lists(), { filters }] as const,
  details: () => [...rewardKeys.all, 'detail'] as const,
  detail: (id: string) => [...rewardKeys.details(), id] as const,
  user: (userId: string) => [...rewardKeys.all, 'user', userId] as const,
}

/**
 * Hook để lấy tất cả phần thưởng của user
 */
export const useUserRewards = (userId: string) => {
  return useQuery({
    queryKey: rewardKeys.user(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_codes')
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
      return data as RewardCode[]
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy chi tiết một phần thưởng
 */
export const useRewardDetail = (rewardId: string) => {
  return useQuery({
    queryKey: rewardKeys.detail(rewardId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_codes')
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
        .eq('id', rewardId)
        .single()

      if (error) throw error
      return data as RewardCode
    },
    enabled: !!rewardId,
  })
}

/**
 * Hook để đổi phần thưởng
 */
export const useRedeemReward = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch(`/api/rewards/${code}/redeem`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error redeeming reward')
      }

      return await response.json()
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: rewardKeys.all })
      queryClient.invalidateQueries({ queryKey: ['profiles'] })

      toast.success(
        data.data.message || 'Phần thưởng đã được đổi thành công!',
        {
          icon: '🎁',
          style: {
            borderRadius: '10px',
            background: '#10b981',
            color: '#fff',
          },
        }
      )
    },
    onError: (error: any) => {
      console.error('Error redeeming reward:', error)
      toast.error(
        error.message || 'Không thể đổi phần thưởng. Vui lòng thử lại.',
        {
          icon: '❌',
        }
      )
    },
  })
}

/**
 * Hook để lấy thống kê phần thưởng
 */
export const useRewardStats = (userId: string) => {
  return useQuery({
    queryKey: [...rewardKeys.user(userId), 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_codes')
        .select('amount, is_used, expiry_date')
        .eq('user_id', userId)

      if (error) throw error

      const currentDate = new Date()
      const stats = {
        totalRewards: data.length,
        totalAmount: data.reduce((sum, reward) => sum + reward.amount, 0),
        redeemedCount: data.filter((r) => r.is_used).length,
        pendingCount: data.filter(
          (r) => !r.is_used && new Date(r.expiry_date) > currentDate
        ).length,
        expiredCount: data.filter(
          (r) => !r.is_used && new Date(r.expiry_date) < currentDate
        ).length,
      }

      return stats
    },
    enabled: !!userId,
  })
}

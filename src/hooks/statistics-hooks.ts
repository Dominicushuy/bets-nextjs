// src/hooks/statistics-hooks.ts
import { useQuery } from '@tanstack/react-query'
import {
  getUserActivityStats,
  getLevelBenefits,
  getUserDetailedStats,
} from '@/services/statistics-service'

// Keys cho React Query caching
export const statisticsKeys = {
  all: ['statistics'] as const,
  userStats: (userId: string, period: string) =>
    [...statisticsKeys.all, 'user', userId, period] as const,
  levelBenefits: (userId: string) =>
    [...statisticsKeys.all, 'level-benefits', userId] as const,
  activities: (userId: string, days: number) =>
    [...statisticsKeys.all, 'activities', userId, days] as const,
}

/**
 * Hook lấy thống kê người dùng
 */
export function useUserStatistics(
  userId: string,
  period: 'week' | 'month' | 'all' = 'all'
) {
  return useQuery({
    queryKey: statisticsKeys.userStats(userId, period),
    queryFn: () => getUserDetailedStats(userId, period),
    enabled: !!userId,
  })
}

/**
 * Hook lấy phúc lợi cấp độ
 */
export function useLevelBenefits(userId: string) {
  return useQuery({
    queryKey: statisticsKeys.levelBenefits(userId),
    queryFn: () => getLevelBenefits(userId),
    enabled: !!userId,
  })
}

/**
 * Hook lấy hoạt động người dùng
 */
export function useUserActivities(userId: string, days = 30) {
  return useQuery({
    queryKey: statisticsKeys.activities(userId, days),
    queryFn: () => getUserActivityStats(userId, days),
    enabled: !!userId,
  })
}

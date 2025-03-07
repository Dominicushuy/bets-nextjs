// src/services/statistics-service.ts
import { createClient } from '@/lib/supabase/client'

/**
 * Lấy thống kê hoạt động của người dùng
 */
export async function getUserActivityStats(userId: string, days = 30) {
  try {
    const response = await fetch(`/api/statistics/activities?days=${days}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error fetching user activities')
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getUserActivityStats:', error)
    throw error
  }
}

/**
 * Lấy phúc lợi theo cấp độ người dùng
 */
export async function getLevelBenefits(userId: string) {
  try {
    const response = await fetch('/api/statistics/level-benefits')

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error fetching level benefits')
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getLevelBenefits:', error)
    throw error
  }
}

/**
 * Lấy thống kê chi tiết của người dùng
 */
export async function getUserDetailedStats(
  userId: string,
  period: 'week' | 'month' | 'all' = 'all'
) {
  try {
    const response = await fetch(`/api/statistics/user?period=${period}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error fetching user statistics')
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getUserDetailedStats:', error)
    throw error
  }
}

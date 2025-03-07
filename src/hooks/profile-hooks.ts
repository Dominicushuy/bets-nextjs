// src/hooks/profile-hooks.ts - Cải tiến
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { ExtendedProfile, UserStatistics } from '@/types/database'
import {
  getExtendedUserProfile,
  getUserActivityStats,
  getUserBetHistory,
  updateUserPreferences,
  updateUserProfile,
} from '@/services/profile-service'

// Keys for React Query caching
export const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (filters: any) => [...profileKeys.lists(), { filters }] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  statistics: (id: string) =>
    [...profileKeys.detail(id), 'statistics'] as const,
  experience: (id: string) =>
    [...profileKeys.detail(id), 'experience'] as const,
  preferences: (id: string) =>
    [...profileKeys.detail(id), 'preferences'] as const,
}

/**
 * Hook để lấy profile đầy đủ của user
 */
export const useExtendedUserProfile = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as ExtendedProfile
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy thống kê của user
 */
export const useUserStatistics = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.statistics(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // Nếu không tìm thấy user_statistics, chỉ trả về null thay vì throw error
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }
      return data as UserStatistics
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy thông tin tiến trình cấp độ
 */
export const useLevelProgress = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.experience(userId),
    queryFn: async () => {
      const response = await fetch(`/api/profile/level-progress`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error fetching level progress')
      }

      return await response.json()
    },
    enabled: !!userId,
  })
}

/**
 * Hook để cập nhật thông tin profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string
      updates: Partial<ExtendedProfile>
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()

      if (error) throw error
      return data[0] as ExtendedProfile
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache khi mutation thành công
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.userId),
      })
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
    },
  })
}

/**
 * Hook để tải lên avatar
 */
export const useUploadProfileAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      // Tạo formData để upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'avatar')

      // Gọi API upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error uploading avatar')
      }

      const result = await response.json()
      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.userId),
      })
    },
    onError: (error: any) => {
      console.error('Error uploading avatar:', error)
    },
  })
}

/**
 * Hook để lấy preferences của user
 */
export const useUserPreferences = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.preferences(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data.preferences || {}
    },
    enabled: !!userId,
  })
}

/**
 * Hook để cập nhật preferences của user
 */
export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      preferences,
    }: {
      userId: string
      preferences: Record<string, any>
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.preferences(variables.userId),
      })
      toast.success('Cài đặt đã được cập nhật')
    },
    onError: (error) => {
      console.error('Error updating preferences:', error)
      toast.error('Không thể cập nhật cài đặt. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để lấy tổng quan thống kê
 */
export const useUserStatisticsSummary = () => {
  return useQuery({
    queryKey: [...profileKeys.all, 'statistics', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/user')

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error fetching user statistics summary')
      }

      return await response.json()
    },
  })
}

/**
 * Hook để quản lý avatar
 */
export const useAvatar = (userId: string) => {
  const queryClient = useQueryClient()

  const { data: profile } = useExtendedUserProfile(userId)

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error uploading avatar')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(userId),
      })
    },
  })

  const removeAvatar = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error removing avatar')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(userId),
      })
    },
  })

  return {
    avatarUrl: profile?.avatar_url,
    isUploading: uploadAvatar.isPending,
    isRemoving: removeAvatar.isPending,
    uploadAvatar: uploadAvatar.mutate,
    removeAvatar: removeAvatar.mutate,
    error: uploadAvatar.error || removeAvatar.error,
  }
}

/**
 * Hook để quản lý thông tin profile
 */
export const useProfile = (userId: string) => {
  const queryClient = useQueryClient()

  // Query để lấy thông tin profile
  const profileQuery = useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getExtendedUserProfile(userId),
    enabled: !!userId,
  })

  // Mutation để cập nhật profile
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<ExtendedProfile>) =>
      updateUserProfile(userId, updates),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.detail(userId), updatedProfile)
      toast.success('Thông tin hồ sơ đã được cập nhật')
    },
    onError: (error: any) => {
      toast.error(`Cập nhật hồ sơ thất bại: ${error.message}`)
    },
  })

  // Mutation để cập nhật preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: Record<string, any>) =>
      updateUserPreferences(userId, preferences),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.detail(userId), updatedProfile)
      toast.success('Tùy chọn đã được cập nhật')
    },
    onError: (error: any) => {
      toast.error(`Cập nhật tùy chọn thất bại: ${error.message}`)
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
  }
}

/**
 * Hook để lấy thống kê hoạt động của người dùng
 */
export const useProfileStats = (
  userId: string,
  period: 'week' | 'month' | 'all' = 'all'
) => {
  return useQuery({
    queryKey: [...profileKeys.statistics(userId), period],
    queryFn: () => getUserActivityStats(userId, period),
    enabled: !!userId,
  })
}

/**
 * Hook để lấy lịch sử đặt cược của người dùng
 */
export const useBetHistory = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...profileKeys.detail(userId), 'bet-history', { page, limit }],
    queryFn: () => getUserBetHistory(userId, page, limit),
    enabled: !!userId,
  })
}

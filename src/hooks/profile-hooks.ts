import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { ExtendedProfile, UserStatistics } from '@/types/database'

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

      if (error) throw error
      return data as UserStatistics
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
      toast.success('Cập nhật hồ sơ thành công')
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại.')
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
      // Tạo tên file độc nhất
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload lên Storage
      const { error: uploadError } = await supabase.storage
        .from('user_avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Lấy URL công khai
      const { data: urlData } = supabase.storage
        .from('user_avatars')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Cập nhật profile với URL avatar
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (profileError) throw profileError

      return profileData as ExtendedProfile
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.userId),
      })
      toast.success('Cập nhật ảnh đại diện thành công')
    },
    onError: (error) => {
      console.error('Error uploading avatar:', error)
      toast.error('Không thể tải lên ảnh đại diện. Vui lòng thử lại.')
    },
  })
}

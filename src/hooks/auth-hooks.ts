// src/hooks/auth-hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'

// Keys for React Query caching
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: (id: string) => [...authKeys.all, 'profile', id] as const,
}

/**
 * Hook để đăng nhập bằng email thuần túy
 */
export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const { data, error } = await signIn(email, password)

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast.success('Đăng nhập thành công')
      queryClient.invalidateQueries({ queryKey: authKeys.session() })
      router.push('/dashboard')
    },
    onError: (error: any) => {
      console.error('Login error:', error)
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để đăng ký
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      displayName,
      phone,
      referralCode,
    }: {
      email: string
      password: string
      displayName?: string
      phone?: string
      referralCode?: string
    }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
          phone,
          referralCode,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error during registration')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để yêu cầu reset mật khẩu
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error requesting password reset')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để đăng xuất
 */
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { signOut } = useAuth()

  return useMutation({
    mutationFn: async () => {
      await signOut()
    },
    onSuccess: () => {
      queryClient.clear() // Xóa tất cả query cache
      toast.success('Đăng xuất thành công')
      router.push('/login')
    },
    onError: (error: any) => {
      console.error('Logout error:', error)
      toast.error('Không thể đăng xuất. Vui lòng thử lại.')
    },
  })
}

/**
 * Hook để kiểm tra trạng thái đăng nhập
 */
export const useCheckAuth = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session
    },
  })
}

/**
 * Hook để cập nhật thông tin người dùng
 */
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      email,
      phone,
      displayName,
    }: {
      email?: string
      phone?: string
      displayName?: string
    }) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: {
            email,
            phone,
            display_name: displayName,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Lỗi khi cập nhật thông tin')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      toast.success('Thông tin cá nhân đã được cập nhật')
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.'
      )
    },
  })
}

/**
 * Hook để thay đổi mật khẩu
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Lỗi khi thay đổi mật khẩu')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Mật khẩu đã được thay đổi thành công')
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Không thể thay đổi mật khẩu. Vui lòng thử lại.'
      )
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { PaymentRequest } from '@/types/database'

// Keys for React Query caching
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: any) => [...paymentKeys.lists(), { filters }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  user: (userId: string) => [...paymentKeys.all, 'user', userId] as const,
}

/**
 * Hook để lấy tất cả payment requests (Admin)
 */
export const usePaymentRequests = (status?: string) => {
  return useQuery({
    queryKey: paymentKeys.list({ status }),
    queryFn: async () => {
      let query = supabase
        .from('payment_requests')
        .select(
          `
          *,
          profiles:user_id (phone),
          processed_by_profile:processed_by (phone)
        `
        )
        .order('request_date', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as PaymentRequest[]
    },
  })
}

/**
 * Hook để lấy payment requests của một user
 */
export const useUserPaymentRequests = (userId: string) => {
  return useQuery({
    queryKey: paymentKeys.user(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('request_date', { ascending: false })

      if (error) throw error
      return data as PaymentRequest[]
    },
    enabled: !!userId,
  })
}

/**
 * Hook để tạo payment request mới
 */
export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      amount,
      proofImage,
    }: {
      amount: number
      proofImage?: File
    }) => {
      // Upload hình ảnh nếu có
      let imageUrl = undefined

      if (proofImage) {
        const formData = new FormData()
        formData.append('file', proofImage)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Error uploading image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      // Tạo payment request
      const response = await fetch('/api/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          proofImage: imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating payment request')
      }

      const data = await response.json()
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      toast.success('Yêu cầu thanh toán đã được gửi thành công!')
    },
    onError: (error: any) => {
      console.error('Error creating payment request:', error)
      toast.error(
        error.message || 'Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.'
      )
    },
  })
}

/**
 * Hook để xử lý payment request (Admin)
 */
export const useProcessPaymentRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      notes,
    }: {
      requestId: string
      status: 'approved' | 'rejected'
      notes?: string
    }) => {
      const response = await fetch(`/api/payment-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error processing payment request')
      }

      const data = await response.json()
      return data
    },
    onSuccess: () => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      toast.success('Xử lý yêu cầu thanh toán thành công!')
    },
    onError: (error: any) => {
      console.error('Error processing payment request:', error)
      toast.error(
        error.message || 'Không thể xử lý yêu cầu thanh toán. Vui lòng thử lại.'
      )
    },
  })
}

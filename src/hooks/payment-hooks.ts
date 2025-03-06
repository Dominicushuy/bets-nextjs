import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { PaymentRequest } from '@/types/database'
import {
  showSuccessToast,
  showErrorToast,
} from '@/components/notifications/notification-helper'

// Keys for React Query caching
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: any) => [...paymentKeys.lists(), { filters }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  user: (userId: string) => [...paymentKeys.all, 'user', userId] as const,
  stats: (userId: string) => [...paymentKeys.all, 'stats', userId] as const,
}

/**
 * Interface cho Payment Request Filters
 */
export interface PaymentRequestFilters {
  status?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  page?: number
  limit?: number
}

/**
 * Hook để lấy tất cả payment requests (Admin)
 */
export const usePaymentRequests = (filters: PaymentRequestFilters = {}) => {
  const {
    status,
    dateRange,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    page = 1,
    limit = 10,
  } = filters

  return useQuery({
    queryKey: paymentKeys.list({
      status,
      dateRange,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      page,
      limit,
    }),
    queryFn: async () => {
      let query = supabase
        .from('payment_requests')
        .select(
          `
          *,
          profiles:user_id (phone, display_name),
          processed_by_profile:processed_by (phone)
        `,
          { count: 'exact' }
        )
        .order('request_date', { ascending: false })

      // Áp dụng các bộ lọc
      if (status) {
        query = query.eq('status', status)
      }

      // Lọc theo khoảng thời gian
      if (dateRange && dateRange !== 'all') {
        const date = new Date()
        if (dateRange === 'today') {
          date.setHours(0, 0, 0, 0)
        } else if (dateRange === 'week') {
          date.setDate(date.getDate() - 7)
        } else if (dateRange === 'month') {
          date.setMonth(date.getMonth() - 1)
        }
        query = query.gte('request_date', date.toISOString())
      } else if (startDate && endDate) {
        query = query
          .gte('request_date', startDate)
          .lte('request_date', endDate)
      }

      // Lọc theo khoảng số tiền
      if (minAmount) {
        query = query.gte('amount', minAmount)
      }

      if (maxAmount) {
        query = query.lte('amount', maxAmount)
      }

      // Tìm kiếm theo số điện thoại người dùng
      if (search) {
        query = query.textSearch('profiles.phone', search, {
          type: 'websearch',
          config: 'english',
        })
      }

      // Phân trang
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as PaymentRequest[],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      }
    },
  })
}

/**
 * Hook để lấy payment requests của một user
 */
export const useUserPaymentRequests = (
  userId: string,
  filters: Partial<PaymentRequestFilters> = {}
) => {
  const { status, dateRange, page = 1, limit = 10 } = filters

  return useQuery({
    queryKey: paymentKeys.user(userId),
    queryFn: async () => {
      let query = supabase
        .from('payment_requests')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('request_date', { ascending: false })

      // Apply filters
      if (status) {
        query = query.eq('status', status)
      }

      // Lọc theo khoảng thời gian
      if (dateRange && dateRange !== 'all') {
        const date = new Date()
        if (dateRange === 'today') {
          date.setHours(0, 0, 0, 0)
        } else if (dateRange === 'week') {
          date.setDate(date.getDate() - 7)
        } else if (dateRange === 'month') {
          date.setMonth(date.getMonth() - 1)
        }
        query = query.gte('request_date', date.toISOString())
      }

      // Phân trang
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as PaymentRequest[],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      }
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy thống kê thanh toán của một user
 */
export const usePaymentStatistics = (userId: string) => {
  return useQuery({
    queryKey: paymentKeys.stats(userId),
    queryFn: async () => {
      // Total payment amount
      const { data: totalData, error: totalError } = await supabase
        .from('payment_requests')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'approved')

      if (totalError) throw totalError

      // Pending payments
      const { data: pendingData, error: pendingError } = await supabase
        .from('payment_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'pending')

      if (pendingError) throw pendingError

      // Recent payment history
      const { data: recentData, error: recentError } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('request_date', { ascending: false })
        .limit(5)

      if (recentError) throw recentError

      // Monthly trends (last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('payment_requests')
        .select('amount, request_date, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .gte('request_date', sixMonthsAgo.toISOString())

      if (monthlyError) throw monthlyError

      // Process monthly data into aggregated format
      const monthlyTrends = monthlyData.reduce(
        (acc: Record<string, number>, item) => {
          const date = new Date(item.request_date)
          const yearMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`

          if (!acc[yearMonth]) {
            acc[yearMonth] = 0
          }

          acc[yearMonth] += item.amount
          return acc
        },
        {}
      )

      // Generate statistics
      return {
        totalDeposited: totalData.reduce((sum, item) => sum + item.amount, 0),
        pendingCount: pendingData.length,
        recentPayments: recentData,
        monthlyTrends,
        allTimeCount: totalData.length,
      }
    },
    enabled: !!userId,
  })
}

/**
 * Hook để lấy chi tiết một payment request
 */
export const usePaymentRequestDetail = (requestId: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(requestId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(
          `
          *,
          profiles:user_id (phone, display_name, email),
          processed_by_profile:processed_by (phone, display_name)
        `
        )
        .eq('id', requestId)
        .single()

      if (error) throw error
      return data as PaymentRequest
    },
    enabled: !!requestId,
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
        formData.append('type', 'payment_proof')

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
      showSuccessToast('Yêu cầu thanh toán đã được gửi thành công!')
    },
    onError: (error: any) => {
      console.error('Error creating payment request:', error)
      showErrorToast(
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
      showSuccessToast('Xử lý yêu cầu thanh toán thành công!')
    },
    onError: (error: any) => {
      console.error('Error processing payment request:', error)
      showErrorToast(
        error.message || 'Không thể xử lý yêu cầu thanh toán. Vui lòng thử lại.'
      )
    },
  })
}

/**
 * Hook để xóa yêu cầu thanh toán (Admin hoặc User đối với yêu cầu pending)
 */
export const useDeletePaymentRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/payment-requests/${requestId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error deleting payment request')
      }

      return { success: true }
    },
    onSuccess: () => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      showSuccessToast('Yêu cầu thanh toán đã được xóa thành công')
    },
    onError: (error: any) => {
      console.error('Error deleting payment request:', error)
      showErrorToast(
        error.message || 'Không thể xóa yêu cầu thanh toán. Vui lòng thử lại.'
      )
    },
  })
}

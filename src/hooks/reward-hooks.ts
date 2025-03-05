import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

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
      queryClient.invalidateQueries({ queryKey: ['rewards'] })
      queryClient.invalidateQueries({ queryKey: ['profiles'] })

      toast.success(data.data.message || 'Phần thưởng đã được đổi thành công!')
    },
    onError: (error: any) => {
      console.error('Error redeeming reward:', error)
      toast.error(
        error.message || 'Không thể đổi phần thưởng. Vui lòng thử lại.'
      )
    },
  })
}

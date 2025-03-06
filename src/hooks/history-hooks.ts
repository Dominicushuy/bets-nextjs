// src/hooks/history-hooks.ts
import { useQuery } from '@tanstack/react-query'

// Keys for React Query caching
export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (filters: any) => [...historyKeys.lists(), { filters }] as const,
}

/**
 * Hook để lấy lịch sử hoạt động
 */
export const useHistoryData = (
  type: 'all' | 'bets' | 'payments' = 'all',
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: historyKeys.list({ type, page, limit }),
    queryFn: async () => {
      const response = await fetch(
        `/api/history?type=${type}&page=${page}&limit=${limit}`
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error fetching history data')
      }

      return await response.json()
    },
  })
}

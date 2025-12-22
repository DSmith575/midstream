import { useQuery } from '@tanstack/react-query'
import { fetchServiceCategories } from '@/lib/api/fetchServiceCategories'

export const useGetServiceCategories = () => {
  return useQuery({
    queryKey: ['serviceCategories'],
    queryFn: () => fetchServiceCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

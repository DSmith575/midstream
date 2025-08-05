import { useQuery } from '@tanstack/react-query'
import { fetchUserReferralForm } from '@/lib/api/fetchUserReferralForm'

export const useGetReferralForms = (userId: string) => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ['referralForms', userId],
    queryFn: () => fetchUserReferralForm(userId),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    enabled: !!userId, // Fetch only when userId is valid
    retry: 2, // Retry fetch on failure up to 2 times
  })

  if (isError) {
    return { isError, error }
  }

  if (isLoading) {
    return { isLoading }
  }

  if (data && isFetched) {
    const referralForms = data.data
    return { isFetched, referralForms }
  }

  return {}
}

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { fetchUserReferralForm } from '@/lib/api/fetchUserReferralForm'

export const useGetReferralForms = (userId: string) => {
  const { getToken } = useAuth()
  
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ['referralForms', userId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return fetchUserReferralForm(userId, token)
    },
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    enabled: !!userId, // Fetch only when userId is valid
    retry: false, // Don't retry on failure, empty array is acceptable
  })

  if (isError) {
    return { isError, error }
  }

  if (isLoading) {
    return { isLoading }
  }

  if (data && isFetched) {
    const referralForms = data.data || []

    return { isFetched, referralForms }
  }

  return { referralForms: [] }
}

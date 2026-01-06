import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import type { UserProfileProps } from '@/lib/interfaces'
import { fetchUserProfile } from '@/lib/api/fetchUser'

export const useUserProfile = (userId: string) => {
  const { getToken } = useAuth()
  
  const { isError, data, error, isFetched, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return fetchUserProfile(userId, token)
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  if (isError) {
    return { isError, error }
  }

  if (data && isFetched) {
    const { personalInformation, addressInformation, contactInformation } = data
    const userData: UserProfileProps = {
      personalInformation: personalInformation,
      addressInformation: addressInformation,
      contactInformation: contactInformation,
      casesCompleted: data.casesCompleted,
      casesAssigned: data.casesAssigned,
      role: data.role,
      company: data.company,
      companyId: data.companyId,
    }

    return { isFetched, userData, isLoading }
  }

  return { isLoading }
}

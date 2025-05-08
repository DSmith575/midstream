import { useSuspenseQuery } from '@tanstack/react-query'
import fetchUserProfile from '@/lib/api/fetchUser'
import type { UserProfileProps } from '@/lib/interfaces'

const useUserProfile = (userId: string) => {
  const { isLoading, isError, data, error, isFetched } = useSuspenseQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    // enabled: !!userId, // Fetch only when userId is valid
    retry: 1, // Retry fetch on failure up to 2 times
  })

  // Handle error state
  if (isError) {
    return { isError, error }
  }

  if (isLoading) {
    return { isLoading }
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
      
    }
    

    return { isFetched, userData }
  }

  return {}
}

export default useUserProfile

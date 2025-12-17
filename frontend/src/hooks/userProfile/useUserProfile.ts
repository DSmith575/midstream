import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserProfileProps } from '@/lib/interfaces'
import { fetchUserProfile } from '@/lib/api/fetchUser'

export const useUserProfile = (userId: string) => {
  const { isError, data, error, isFetched, isLoading } = useSuspenseQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 5 * 60 * 1000,
    // enabled: !!userId, // Fetch only when userId is valid
    retry: 1,
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

  return {}
}

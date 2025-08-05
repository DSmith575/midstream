import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useUserProfile } from '@/hooks/userProfile/useUserProfile'
import { preloadReferralFormData } from '@/lib/formOptions/referralFormPreload'
import { referralFormStore } from '@/lib/store/referralFormStore'

/**
 * This hook is used to preload user referral data into the referral form store.
 * It fetches the user profile data and maps it to the referral form data structure.
 */
export const usePreloadedUserReferralData = () => {
  const { userId } = useAuth()
  const { isError, userData } = useUserProfile(userId as string)

  useEffect(() => {
    if (userData) {
      const mapped = preloadReferralFormData(userData)
      referralFormStore.setState((state) => ({
        ...state,
        referralFormData: mapped,
      }))
    }
  }, [userData])

  return { userId, userData, isError }
}

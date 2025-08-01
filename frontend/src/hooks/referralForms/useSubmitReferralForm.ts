import { useNavigate } from '@tanstack/react-router'
import { useCreateReferralForm } from '@/hooks/referralForms/'
import { buildReferralDetails } from '@/lib/functions/formFunctions'
import { routeConstants } from '@/lib/constants'

// This hook is used to submit the referral form data.
// It takes the userId and userData as parameters, and uses the useCreateReferralForm hook to handle the submission.
export const useSubmitReferralForm = (userId: string | null, userData: any) => {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateReferralForm(userId as string, () => {
    navigate({ to: routeConstants.dashboard })
  })

  const submit = (values: any) => {
    if (!userId) return
    const referralDetails = buildReferralDetails(
      userId,
      userData?.company?.id,
      values,
    )
    try {
      mutate(referralDetails)
    } catch (error) {
      console.error(error)
    }
  }

  return { submit, isPending }
}

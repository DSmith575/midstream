import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateReferralProps } from '@/lib/interfaces'
import { postReferralForm } from '@/lib/api/postReferralForm'

export const useCreateReferralForm = (
  userId: string,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (referralData: CreateReferralProps) =>
      postReferralForm(referralData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralForms', userId] })
      onSuccessCallback?.()
    },
  })

  return mutation
}

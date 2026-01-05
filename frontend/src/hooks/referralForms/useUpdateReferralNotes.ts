import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReferralNote } from '@/lib/api/updateReferralNotes'

export const useCreateReferralNote = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      referralId,
      content,
    }: {
      referralId: string
      content: string
    }) => createReferralNote(referralId, content),
    onSuccess: () => {
      // Invalidate and refetch referral forms to get updated data
      queryClient.invalidateQueries({
        queryKey: ['referralForms', userId],
      })
    },
  })
}

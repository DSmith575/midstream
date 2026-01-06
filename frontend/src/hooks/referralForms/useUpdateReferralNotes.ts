import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { createReferralNote } from '@/lib/api/updateReferralNotes'

export const useCreateReferralNote = (userId: string) => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      referralId,
      content,
    }: {
      referralId: string
      content: string
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return createReferralNote(referralId, content, token)
    },
    onSuccess: () => {
      // Invalidate and refetch referral forms to get updated data
      queryClient.invalidateQueries({
        queryKey: ['referralForms', userId],
      })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import type { CreateReferralProps } from '@/lib/interfaces'
import { postReferralForm } from '@/lib/api/postReferralForm'

export const useCreateReferralForm = (
  userId: string,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  
  const mutation = useMutation({
    mutationFn: async (referralData: CreateReferralProps) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return postReferralForm(referralData, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralForms', userId] })
      onSuccessCallback?.()
    },
  })

  return mutation
}

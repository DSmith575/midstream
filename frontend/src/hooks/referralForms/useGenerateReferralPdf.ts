import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { generateReferralPdf } from '@/lib/api/generateReferralPdf'

export const useGenerateReferralPdf = (userId: string) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return generateReferralPdf(formId, token)
    },
    onSuccess: async ({ blob, fileName }, formId) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || `${formId}-referral.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      await queryClient.invalidateQueries({ queryKey: ['referralForms', userId] })
    },
  })
}

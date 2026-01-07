import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { generateReferralPdf } from '@/lib/api/generateReferralPdf'

export const useGenerateReferralPdf = () => {
  const { getToken } = useAuth()
  return useMutation({
    mutationFn: async (formId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return generateReferralPdf(formId, token)
    },
    onSuccess: (blob, formId) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formId}-referral.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
  })
}

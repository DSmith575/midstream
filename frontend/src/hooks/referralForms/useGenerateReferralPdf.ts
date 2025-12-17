import { useMutation } from '@tanstack/react-query'
import { generateReferralPdf } from '@/lib/api/generateReferralPdf'

export const useGenerateReferralPdf = () => {
  return useMutation({
    mutationFn: async (formId: string) => generateReferralPdf(formId),
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

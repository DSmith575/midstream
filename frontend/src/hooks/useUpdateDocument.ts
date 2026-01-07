import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'
import { updateDocumentTranscribedContent } from '@/lib/api/updateDocument'

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      documentId,
      transcribedContent,
    }: {
      documentId: string
      transcribedContent: string
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return updateDocumentTranscribedContent(documentId, transcribedContent, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralForms'] })
      toast.success('Document updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update document')
    },
  })
}

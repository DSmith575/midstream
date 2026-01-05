import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateDocumentTranscribedContent } from '@/lib/api/updateDocument'

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      documentId,
      transcribedContent,
    }: {
      documentId: string
      transcribedContent: string
    }) => updateDocumentTranscribedContent(documentId, transcribedContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralForms'] })
      toast.success('Document updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update document')
    },
  })
}

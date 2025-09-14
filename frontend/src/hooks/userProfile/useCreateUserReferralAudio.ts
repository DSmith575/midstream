import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserReferralAudio } from '@/lib/api/createUserReferralAudioFile'

export const useCreateUserReferralAudio = (
  userId: string,
  onSuccessCallback?: () => void,
) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ file, referralId }: { file: File; referralId: string }) =>
      createUserReferralAudio(file, referralId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['referralForms', userId],
      })
      onSuccessCallback?.()
    },
  })

  return mutation
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateUserProps } from '@/lib/interfaces'
import { postUserProfile } from '@/lib/api/postCreateUserProfile'

export const useCreateUserProfile = (
  userId: string,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (userData: CreateUserProps) => postUserProfile(userData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      onSuccessCallback?.()
    },
  })

  return mutation
}

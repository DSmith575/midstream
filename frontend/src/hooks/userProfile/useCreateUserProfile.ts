import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import type { CreateUserProps } from '@/lib/interfaces'
import { postUserProfile } from '@/lib/api/postCreateUserProfile'

export const useCreateUserProfile = (
  userId: string,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  
  const mutation = useMutation({
    mutationFn: async (userData: CreateUserProps) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return postUserProfile(userData, token)
    },
    onSuccess: () => {
      // Invalidate queries with a small delay to allow database to commit
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      }, 500)
      onSuccessCallback?.()
    },
  })

  return mutation
}

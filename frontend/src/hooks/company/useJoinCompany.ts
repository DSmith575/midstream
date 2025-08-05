import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { JoinCompanyProps } from '@/lib/interfaces'
import { postJoinCompany } from '@/lib/api/postJoinCompany'

export const useJoinCompany = (
  userId: string,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ data }: { data: JoinCompanyProps }) =>
      postJoinCompany(data.companyId, data.userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      onSuccessCallback?.()
    },
  })

  return mutation
}

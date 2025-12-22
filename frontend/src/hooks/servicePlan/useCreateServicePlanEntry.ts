import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateServicePlanEntryProps } from '@/lib/interfaces'
import { postServicePlanEntry } from '@/lib/api/postServicePlanEntry'

export const useCreateServicePlanEntry = (
  servicePlanId: string,
  onSuccessCallback: (data: any) => void,
) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (servicePlanData: CreateServicePlanEntryProps) =>
      postServicePlanEntry(servicePlanData),
    onSuccess: (data: any) => {
      console.log('data', data)
      queryClient.invalidateQueries({
        queryKey: ['servicePlan', servicePlanId],
      })
      onSuccessCallback?.(data)
    },
  })

  return mutation
}

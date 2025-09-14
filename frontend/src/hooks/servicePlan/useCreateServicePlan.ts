import { useMutation } from '@tanstack/react-query'
import type { CreateServicePlanProps } from '@/lib/interfaces'
import { postServicePlan } from '@/lib/api/postServicePlan'

export const useCreateServicePlan = (
  onSuccessCallback: (data: any) => void,
) => {
  const mutation = useMutation({
    mutationFn: (servicePlanData: CreateServicePlanProps) =>
      postServicePlan(servicePlanData),
    onSuccess: (data: any) => {
      onSuccessCallback?.(data)
    },
  })

  return mutation
}

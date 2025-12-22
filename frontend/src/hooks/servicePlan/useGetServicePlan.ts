import { useQuery } from '@tanstack/react-query'
import { fetchServicePlan } from '@/lib/api/fetchServicePlan'

export type ServicePlanFilter = {
  servicePlanId: string
}

export const useGetServicePlan = ({ servicePlanId }: ServicePlanFilter) => {
  return useQuery({
    queryKey: ['servicePlan', servicePlanId],
    queryFn: () => fetchServicePlan(servicePlanId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

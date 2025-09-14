import { useQuery } from '@tanstack/react-query'
import { fetchServiceCases } from '@/lib/api/fetchServiceCases'

export type CaseWorkerFilter = {
  caseWorkerId: string
}

export const useGetCaseWorkerServiceCases = ({
  caseWorkerId,
}: CaseWorkerFilter) => {
  return useQuery({
    queryKey: ['caseWorkerServiceCases', caseWorkerId],
    queryFn: () => fetchServiceCases({ caseWorkerId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

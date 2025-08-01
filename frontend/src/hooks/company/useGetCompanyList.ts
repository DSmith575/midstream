import { useQuery } from '@tanstack/react-query'
import type { CompanyProps } from '@/lib/interfaces'
import { fetchCompanyList } from '@/lib/api/fetchCompanyList'

export const useGetCompanyList = (userId: string) => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ['companyList', userId],
    queryFn: () => fetchCompanyList(),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
    retry: 2,
  })

  if (isError) {
    return { isError, error }
  }

  if (isLoading) {
    return { isLoading }
  }

  if (data && isFetched) {
    const companyList: Array<CompanyProps> = data
    return { isFetched, companyList }
  }

  return {}
}

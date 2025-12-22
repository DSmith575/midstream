import { useQuery } from '@tanstack/react-query'
import { fetchCompanyReferrals } from '@/lib/api/fetchCompanyReferrals'

export type ReferralFilter = {
  // TODO: Allow array filters?
  assignedWorkerId?: string
  companyId: number
}

export const useGetAllCompanyReferrals = ({
  companyId,
  assignedWorkerId,
}: ReferralFilter) => {
  const query = useQuery({
    queryKey: ['companyReferrals', companyId, assignedWorkerId], // <- include companyId to avoid stale caching
    queryFn: () => fetchCompanyReferrals(companyId, { assignedWorkerId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })

  const { data, isFetched } = query

  const referrals =
    data && isFetched
      ? data.data.map((referral: any) => ({
          ...referral,
          name: `${referral.user.personalInformation.firstName} ${referral.user.personalInformation.lastName}`,
          city: referral.user.addressInformation.city,
          formSubmitted: new Date(referral.createdAt).toLocaleDateString(),
          lastUpdate: new Date(referral.updatedAt).toLocaleDateString(),
          assignedTo: referral.assignedToWorkerId
            ? `${referral.assignedToWorker.personalInformation.firstName} ${referral.assignedToWorker.personalInformation.lastName}`
            : '',
          status: referral.status,
        }))
      : []

  return {
    ...query,
    referrals,
  }
}

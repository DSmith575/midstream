import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import fetchCompanyReferrals from "@/lib/api/fetchCompanyReferrals";

const useGetAllCompanyReferrals = ({
  options,
  companyId,
}: {
  options?: { enabled: boolean },
  companyId: number
}) => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ["companyReferrals"],
    queryFn: () => fetchCompanyReferrals({ companyId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? false,
  });

  if (!options?.enabled) {
    return { isLoading, isError, data, error };
  }


  // Handle error state
  if (isError) {
    return { isError, error };
  }

  if (isLoading) {
    return { isLoading };
  }

  if (data && isFetched) {
    const referrals = data.data.map((referral: any) => ({
      ...referral,
      name: `${referral.user.personalInformation.firstName} ${referral.user.personalInformation.lastName}`,
      city: referral.user.addressInformation.city,
      formSubmitted: new Date(referral.createdAt).toLocaleDateString(),
      lastUpdate: new Date(referral.updatedAt).toLocaleDateString(),
      assignedTo: referral.assignedToWorkerId ? `${referral.assignedToWorker.personalInformation.firstName} ${referral.assignedToWorker.personalInformation.lastName}` : "",
      status: referral.status,
    }));

    return { isFetched, referrals };
  }

  return {};
};

export default useGetAllCompanyReferrals;
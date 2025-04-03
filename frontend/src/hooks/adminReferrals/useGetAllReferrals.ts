import { useQuery } from "@tanstack/react-query";
import fetchAllReferrals from "@/utils/api/fetchAllReferrals";

const useGetAllReferrals = () => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ["adminReferrals"],
    queryFn: () => fetchAllReferrals(),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    retry: 2, // Retry fetch on failure up to 2 times
    refetchInterval: 2 * 60 * 1000, // Refetch every 10 minutes
  });

  // Handle error state
  if (isError) {
    return { isError, error };
  }

  if (isLoading) {
    return { isLoading };
  }

  if (data && isFetched) {
    const referrals = data.data;
    return { isFetched, referrals };
  }

  return {};
};

export default useGetAllReferrals;
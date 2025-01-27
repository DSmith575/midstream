import { useQuery } from "@tanstack/react-query";
import fetchUserProfile from "@/utils/api/fetchUser";
import { UserProfileProps } from "@/interfaces/profileInterfaces";

const useUserProfile = (userId: string) => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    enabled: !!userId, // Fetch only when userId is valid
    retry: 2, // Retry fetch on failure up to 2 times
  });

  // Handle error state
  if (isError) {
    return { isError, error };
  }

  if (isLoading) {
    return { isLoading };
  }

  if (data && isFetched) {
    const { personalInformation, addressInformation, contactInformation } = data;
    const userData: UserProfileProps = {
      personalInformation: personalInformation?.[0] ?? null,
      addressInformation: addressInformation?.[0] ?? null,
      contactInformation: contactInformation?.[0] ?? null,
    };

    return { isFetched, userData };
  }

  return {};
};

export default useUserProfile;

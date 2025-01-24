import { useQuery } from "@tanstack/react-query";
import fetchUserProfile from "@/utils/api/fetchUser";


// TODO: Fix errors showing in console when trying to fetch user profile
const useUserProfile = (userId: string) => {
	const { isPending, isError, data, error, isFetched } = useQuery({
		queryKey: ["userProfile", userId],
		queryFn: () => fetchUserProfile(userId),
		staleTime: 5 * 60 * 1000,
		enabled: !!userId,
		retry: 2,
  });

  if (isError) {
    return { isError, error };
  }
	if (isPending) {
		return { isPending };
	}


  if (isFetched)
    console.log('hit')
	return { data };
};

export default useUserProfile;

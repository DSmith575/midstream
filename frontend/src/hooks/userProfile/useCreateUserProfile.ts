import { useMutation, useQueryClient } from "@tanstack/react-query";
import postUserProfile from "@/utils/api/postUserProfile";
import { CreateUserProps } from "@/interfaces/profileInterfaces";

const useCreateUserProfile = (userId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userData: CreateUserProps) => postUserProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"], userId });
    }
  });

  return mutation;
};

export default useCreateUserProfile;
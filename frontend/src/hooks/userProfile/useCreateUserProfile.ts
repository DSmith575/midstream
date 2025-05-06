import { useMutation, useQueryClient } from "@tanstack/react-query";
import postCreateUserProfile from "@/lib/api/postCreateUserProfile";
import type { CreateUserProps } from "@/lib/profileInterfaces";

const useCreateUserProfile = (userId: string, onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userData: CreateUserProps) => postCreateUserProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      onSuccessCallback?.();
    }
  });

  return mutation;
};

export default useCreateUserProfile;
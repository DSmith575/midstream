import { useMutation } from "@tanstack/react-query";
import postUserProfile from "@/utils/api/postUserProfile";
import { CreateUserProps } from "@/interfaces/profileInterfaces";

const useCreateUserProfile = () => {
  const mutation = useMutation({
    mutationFn: (userData: CreateUserProps) => postUserProfile(userData),
  });

  return mutation;
};

export default useCreateUserProfile;
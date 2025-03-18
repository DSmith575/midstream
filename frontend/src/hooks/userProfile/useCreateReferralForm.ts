import { useMutation } from "@tanstack/react-query";
import postReferralForm from "@/utils/api/postReferralForm";
import { CreateReferralProps } from "@/interfaces/profileInterfaces";

const useCreateReferralForm = () => {
  const mutation = useMutation({
    mutationFn: (referralData: CreateReferralProps) => postReferralForm(referralData),
  });

  return mutation;
};

export default useCreateReferralForm;
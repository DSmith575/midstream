import { useMutation, useQueryClient } from "@tanstack/react-query";
import postReferralForm from "@/utils/api/postReferralForm";
import { CreateReferralProps } from "@/interfaces/profileInterfaces";

const useCreateReferralForm = (userId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (referralData: CreateReferralProps) => postReferralForm(referralData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralForms"], userId });
    },
  });

  return mutation;
};

export default useCreateReferralForm;
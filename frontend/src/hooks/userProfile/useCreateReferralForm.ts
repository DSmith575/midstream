import { useMutation, useQueryClient } from "@tanstack/react-query";
import postReferralForm from "@/lib/api/postReferralForm";
import type { CreateReferralProps } from "@/lib/interfaces";

const useCreateReferralForm = (userId: string, onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (referralData: CreateReferralProps) => postReferralForm(referralData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralForms", userId] });
      onSuccessCallback?.();
    },
  });

  return mutation;
};

export default useCreateReferralForm;
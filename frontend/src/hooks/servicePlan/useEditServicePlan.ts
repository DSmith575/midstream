import { useNavigate } from "@tanstack/react-router";
import { useCreateServicePlan } from "./useCreateServicePlan";
import { routeConstants } from "@/lib/constants";

// This hook will create a service plan against a service case if one does not already exist
// Then navigate to the edit page
export const useEditServicePlan = (serviceCaseId: string, servicePlanId?: string) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateServicePlan((data: any) => {
    navigate({ to: `${routeConstants.dashboard}/servicePlan/${data.data.id}` });
  })

  const editServicePlan = () => {
    if (servicePlanId) {
      navigate({ to: `${routeConstants.dashboard}/servicePlan/${servicePlanId}` });
    } else {
      try {
        mutate({ serviceCaseId });
      } catch (error) {
        console.error(error);
      }
    }    
  }
  return { editServicePlan, isPending };
}        
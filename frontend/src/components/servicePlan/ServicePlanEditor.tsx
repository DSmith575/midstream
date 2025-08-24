import { useGetServicePlan } from "@/hooks/servicePlan"
import { ServicePlanEntryTable } from "./ServicePlanEntryTable";
import { ServicePlanEntryColumns } from './ServicePlanEntryColumns'
import { Spinner } from "../spinner/Spinner";
import { ServicePlanSummary } from "./ServicePlanSummary";

interface ServicePlanEditorProps {
  servicePlanId: string
}

export const ServicePlanEditor = ({
  servicePlanId,
}: ServicePlanEditorProps
) => {
  const { isLoading, data: { data: servicePlan } = { data: {} }} = useGetServicePlan({
    servicePlanId
  })

  if (isLoading) {
    return <Spinner />
  }

  const personalInfo = servicePlan?.serviceCase?.user?.personalInformation;

  return (
    <div className="mt-2 col-start-1" style={{ margin: '1rem 20% 20%' }}>
      <main className="w-full col-span-1 max-h-[300px] rounded-2xl bg-white shadow-lg  mx-auto p-6 sm:p-8 space-y-6 relative">
        <section className="flex flex-col items-center">
          <h1 className="text-x1 -mt-2">
            Service Plan for {personalInfo?.firstName} {personalInfo?.lastName} 
          </h1>
        </section>
        <hr className="border-gray-200" />
        <ServicePlanSummary serviceList={servicePlan?.services} />
      </main>
      <ServicePlanEntryTable servicePlanId={servicePlan.id} entries={servicePlan.services} columns={ServicePlanEntryColumns} />
    </div>
  )
}
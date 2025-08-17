import { useGetServicePlan } from "@/hooks/servicePlan"
import { ServicePlanEntryTable } from "./ServicePlanEntryTable";
import { ServicePlanEntryColumns } from './ServicePlanEntryColumns'
import { Spinner } from "../spinner/Spinner";

interface ServicePlanEditorProps {
  servicePlanId: string
}

type HourStatProps = {
  label: string
  value: number | string | undefined
}

const HourStat = ({ label, value }: HourStatProps) => (
  <div className="flex flex-col items-center">
    <h2 className="text-xl font-bold text-muted-foreground">{value ?? '—'}</h2>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
)

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
  const allocatedMinutes = servicePlan?.services?.reduce((minutes: { total: number, fixed: number, flexible: number }, currentValue: any) => {
    minutes.total += currentValue.allocatedMinutes;
    if(currentValue.serviceCategory.flexibleHours) {
      minutes.flexible += currentValue.allocatedMinutes;
    } else {
      minutes.fixed += currentValue.allocatedMinutes;
    }
    return minutes;
  }, { total: 0, fixed: 0, flexible: 0 })
  // TODO: Add modal for creating new entries

  return (
    <div className="mt-2 col-start-1" style={{ margin: '1rem 20% 20%' }}>
      <main className="w-full col-span-1 max-h-[300px] rounded-2xl bg-white shadow-lg  mx-auto p-6 sm:p-8 space-y-6 relative">
        <section className="flex flex-col items-center">
          <h1 className="text-x1 -mt-2">
            Service Plan for {personalInfo?.firstName} {personalInfo?.lastName} 
          </h1>
        </section>
        <hr className="border-gray-200" />
        <section className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-6 w-full max-w-s justify-items-center">
            <HourStat label="Fixed Hours" value={allocatedMinutes.fixed / 60} />
            <HourStat label="Flexible Hours" value={allocatedMinutes.flexible / 60} />
            <HourStat label="Total Hours" value={allocatedMinutes.total / 60} />
          </div>
        </section>
      </main>
      <ServicePlanEntryTable servicePlan={servicePlan.id} entries={servicePlan.services} columns={ServicePlanEntryColumns} />
    </div>
  )
}
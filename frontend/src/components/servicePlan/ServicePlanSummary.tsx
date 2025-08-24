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

interface ServicePlanSummaryProps {
  serviceList: Array<{ allocatedMinutes: number, flexibleHours: boolean }>
}

export const ServicePlanSummary = ({
  serviceList
}: ServicePlanSummaryProps) => {
  const allocatedMinutes = serviceList?.reduce((minutes: { total: number, fixed: number, flexible: number }, currentValue: any) => {
    minutes.total += currentValue.allocatedMinutes;
    if(currentValue.serviceCategory.flexibleHours) {
      minutes.flexible += currentValue.allocatedMinutes;
    } else {
      minutes.fixed += currentValue.allocatedMinutes;
    }
    return minutes;
  }, { total: 0, fixed: 0, flexible: 0 });

  return (
    <section className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-6 w-full max-w-s justify-items-center">
        <HourStat label="Fixed Hours" value={(allocatedMinutes.fixed / 60).toFixed(1)} />
        <HourStat label="Flexible Hours" value={(allocatedMinutes.flexible / 60).toFixed(1)} />
        <HourStat label="Total Hours" value={(allocatedMinutes.total / 60).toFixed(1)} />
      </div>
    </section>
  )
}
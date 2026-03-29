import { createFileRoute } from '@tanstack/react-router'
import { ServicePlanEditor } from '@/components/servicePlan/ServicePlanEditor'

const RouteComponent = () => {
  const { servicePlanId } = Route.useParams()
  return <ServicePlanEditor servicePlanId={servicePlanId} />
}

export const Route = createFileRoute('/my-story_/servicePlan/$servicePlanId')({
  component: RouteComponent,
})

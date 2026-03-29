import { createFileRoute } from '@tanstack/react-router'
import { ReferralForm } from '@/components/forms/referralForm/ReferralForm'

const RouteComponent = () => {
  return <ReferralForm />
}

export const Route = createFileRoute('/my-story_/referral/$userId')({
  component: RouteComponent,
})

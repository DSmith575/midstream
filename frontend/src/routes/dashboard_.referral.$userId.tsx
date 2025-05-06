import ReferralForm from '@/components/forms/referralForm/ReferralForm';
import { createFileRoute } from '@tanstack/react-router'



const RouteComponent = () => {
  return (
    <ReferralForm />
  )
}

export const Route = createFileRoute('/dashboard_/referral/$userId')({
  component: RouteComponent,
});
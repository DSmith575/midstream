import { ApplicationCard } from '@/components/profile/card/applicationCard/ApplicationCard'

export const ApplicationView = ({ userId }: { userId: string }) => {
  return (
      <ApplicationCard userId={userId} />
  )
}

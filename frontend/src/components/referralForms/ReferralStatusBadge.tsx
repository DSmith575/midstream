import { Badge } from '@/components/ui/badge'

type colorMap = {
  [key: string]: string
}
const statusColorMap: colorMap = {
  SUBMITTED: 'bg-green-100',
  PENDING: 'bg-yellow-100',
  REJECTED: 'bg-red-100',
  APPROVED: 'bg-blue-100',
  COMPLETED: 'bg-purple-100',
  CANCELLED: 'bg-gray-100',
  ASSIGNED: 'bg-orange-100',
}

interface ReferralStatusBadgeProps {
  status: string
}

export const ReferralStatusBadge = ({
  status
}: ReferralStatusBadgeProps) => {
  return (
    <Badge
      className={`block cursor-default text-black ${
          statusColorMap[status]
      }`}
    >
      {status}
    </Badge>
  )
}

import type { ColumnDef } from '@tanstack/react-table'
import { TextSpan } from '../text/TextSpan'

export const ServicePlanEntryColumns: Array<ColumnDef<any>> = [
  {
    accessorKey: 'serviceCategory.serviceName',
    header: 'Service Category',
  },
  {
    accessorFn: (row) => row.allocatedMinutes / 60,
    header: 'Hours'
  },
  {
    accessorFn: (row) => row.serviceCategory.flexibleHours ? 'Flexible' : 'Fixed',
    header: 'Fixed/Flexible'
  },
  {
    accessorFn: (row) => row.comments.map(({ comment }: { comment: string }) => (<TextSpan text={comment} />)),
    header: 'Comment'
  },
]

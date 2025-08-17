import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ReferralStatusBadge } from '@/components/referralForms';

// export interface DataProps {
//   name: string
//   formSubmitted: string
//   status: string
// }

export const caseWorkerColumns: Array<ColumnDef<any>> = [
  {
    accessorFn: (row) => `${row.user.personalInformation.firstName} ${row.user.personalInformation.lastName}`,
    header: 'Name',
  },
  {
    accessorKey: 'user.addressInformation.city',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          City
          <ArrowUpDown className={'h-4 w-4'} />
        </Button>
      )
    },
  },
  {
    accessorFn: (row) => new Date(row.referralForm.createdAt).toLocaleDateString(),
    id: 'formSubmitted',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Submission Date
          <ArrowUpDown className={'h-4 w-4'} />
        </Button>
      )
    },
  },
  {
    accessorKey: 'referralForm.status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className={'ml-2 h-4 w-4'} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <ReferralStatusBadge status={row.original.referralForm.status} />
    }
  },
]

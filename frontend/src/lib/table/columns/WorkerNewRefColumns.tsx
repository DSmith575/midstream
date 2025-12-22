import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ReferralStatusBadge } from '@/components/referralForms'

export interface DataProps {
  name: string
  city: string
  formSubmitted: string
  status: string
}

export const workerNewRefColumns: Array<ColumnDef<DataProps>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'city',
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
    accessorFn: (row) => {
      const [day, month, year] = row.formSubmitted.split('/')
      return new Date(`${year}-${month}-${day}`)
    },
    id: 'formSubmitted',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Submission Date
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.formSubmitted
      return <div>{date}</div>
    },
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className={'h-4 w-4'} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <ReferralStatusBadge status={row.original.status} />
    },
  },
]

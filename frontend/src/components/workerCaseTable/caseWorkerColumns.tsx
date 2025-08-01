import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

export interface DataProps {
  name: string
  formSubmitted: string
  status: string
}

export const caseWorkerColumns: Array<ColumnDef<DataProps>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'formSubmitted',
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
    accessorKey: 'status',
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
  },
]

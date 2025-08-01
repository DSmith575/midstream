import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

export interface DataProps {
  name: string
  city: string
  formSubmitted: string
}

export const columns: Array<ColumnDef<DataProps>> = [
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
]

import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useGetCaseWorkerServiceCases } from '@/hooks/serviceCase/useGetCaseWorkerServiceCases'

import { CaseModal } from './CaseModal'

interface DataTableProps<TData, TValue> {
  caseWorkerId: string
  columns: Array<ColumnDef<TData, TValue>>
  data?: Array<TData>
}

export const CaseWorkerTable = <TData, TValue>({
  caseWorkerId,
  columns,
}: DataTableProps<TData, TValue>) => {
  const { isLoading, data: { data: serviceCases } = { data: [] } } = useGetCaseWorkerServiceCases({
    caseWorkerId
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [open, setOpen] = useState(false)
  const [serviceCase, setServiceCase] = useState<any>(null)

  if (!caseWorkerId) {
    return (
      <div className="text-red-500">
        You must be assigned a case worker to view referrals.
      </div>
    )
  }

  const memoizedColumns = useMemo(() => columns, [columns])
  const memoizedServiceCases = useMemo(() => serviceCases, [isLoading])

  const table = useReactTable({
    data: memoizedServiceCases,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={'text-center text-black'}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => {
                    setServiceCase(row.original), setOpen(true)
                  }}
                  className={'text-center cursor-pointer hover:bg-gray-100'}
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {open && serviceCase && (
				<CaseModal
					caseData={serviceCase}
					setOpen={setOpen}
					open={open}
				/>
      )}
    </>
  )
}
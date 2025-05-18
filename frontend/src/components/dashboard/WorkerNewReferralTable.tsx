import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/spinner/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { SortingState, ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import useGetAllCompanyReferrals from '@/hooks/workerReferrals/useGetAllCompanyReferrals'
import WorkerAssignCase from '@/components/dashboard/WorkerAssignCase'


interface DataTableProps<TData, TValue> {
  caseWorkerId?: string
  companyId: number
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
}

const WorkerReferralTable = <TData, TValue>({
  caseWorkerId,
  companyId,
  columns,
}: DataTableProps<TData, TValue>) => {
	const { isLoading, referrals } = useGetAllCompanyReferrals({
    companyId});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [open, setOpen] = useState(false);
	const [referralForm, setReferralForm] = useState<any>(null);

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedReferrals = useMemo(() => referrals, []);

	const table = useReactTable({
		data: memoizedReferrals,
		columns: memoizedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});



	if (isLoading) {
		return <Spinner />;
	}

	console.log('hello')

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
										className={"text-center text-black"}>
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									onClick={() => {
										setReferralForm(row.original), setOpen(true);
									}}
									className={"text-center cursor-pointer hover:bg-gray-100"}
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
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
									className="h-24 text-center">
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
					disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>

			{open && referralForm && (
				<WorkerAssignCase caseWorkerId={caseWorkerId} referralForm={referralForm} setOpen={setOpen} open={open} />
			)}
		</>
	);
};

export default WorkerReferralTable

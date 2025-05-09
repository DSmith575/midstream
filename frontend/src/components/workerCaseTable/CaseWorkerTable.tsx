import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import useGetAllCompanyReferrals from "@/hooks/workerReferrals/useGetAllCompanyReferrals";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReferralFormCaseWorkerButton from "@/components/referralForms/ReferralFormCaseWorkerButton";
import Spinner from "../spinner/Spinner";

interface DataTableProps<TData, TValue> {
	orgRole: string;
	caseWorkerId: string;
	showReferrals?: boolean;
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const CaseWorkerTable = <TData, TValue>({
	caseWorkerId,
	orgRole,
	showReferrals,
	columns,
	data,
}: DataTableProps<TData, TValue>) => {
	const { isLoading, data: referrals } = useGetAllCompanyReferrals({
		enabled: !!showReferrals, // Enable the query only if showReferrals is true
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [open, setOpen] = useState(false);
	const [referralForm, setReferralForm] = useState<any>(null);

	const table = useReactTable({
		data: showReferrals && referrals ? referrals : data || [], // ← guarantees it's an array
		columns,
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
									className={"text-center"}
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
				<ReferralFormCaseWorkerButton caseWorkerId={caseWorkerId} referralForm={referralForm} setOpen={setOpen} orgRole={orgRole} open={open} />
			)}
		</>
	);
};

export default CaseWorkerTable;
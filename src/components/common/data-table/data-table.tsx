"use client";

import type { ColumnMeta } from "@/components/common/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ClassValue } from "clsx";
import * as React from "react";

type DataTableProps<TData, TValue> = {
	rowsPerPage: number;
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	title?: string;
	renderToolbar?: () => React.ReactNode;
	rowClassName?: ClassValue | ClassValue[];
	onClickBuilder?: (row: TData) => void;
	disablePagination?: boolean;
	tableClassName?: ClassValue | ClassValue[];
	globalClassName?: ClassValue | ClassValue[];
};

export function DataTable<TData, TValue>({
	columns,
	data,
	title,
	renderToolbar,
	rowClassName,
	rowsPerPage,
	onClickBuilder,
	disablePagination,
	tableClassName,
	globalClassName,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: rowsPerPage,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: disablePagination ? undefined : getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	React.useEffect(() => {
		if (!disablePagination) {
			setPagination((prev) => ({
				...prev,
				pageSize: rowsPerPage,
			}));
		}
	}, [rowsPerPage, disablePagination]);

	console.log(pagination);

	return (
		<Card className="w-full bg-none">
			<CardHeader className={cn(globalClassName)}>
				{title && <CardTitle>{title}</CardTitle>}
				{renderToolbar && <div className={cn("mt-4", globalClassName)}>{renderToolbar()}</div>}
			</CardHeader>
			<CardContent>
				<div className={cn("rounded-md border bg-card", globalClassName, tableClassName)}>
					<Table className={cn("", globalClassName, tableClassName)}>
						<TableHeader className={cn("sticky top-0 z-10", globalClassName)}>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className={cn(globalClassName)}>
									{headerGroup.headers.map((header) => {
										const meta = header.column.columnDef.meta as ColumnMeta<TData> | undefined;
										return (
											<TableHead
												key={header.id}
												style={{
													width: header.getSize() !== 150 ? header.getSize() : undefined,
												}}
												className={cn(
													globalClassName,
													meta?.align === "right" && "text-right",
													meta?.align === "center" && "text-center",
													meta?.className,
												)}
												abbr={meta?.abreviation}
											>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className={cn(globalClassName)}>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									return (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
											className={cn(
												"h-24",
												onClickBuilder && "hover:cursor-pointer",
												globalClassName,
												rowClassName,
											)}
											onClick={() => {
												onClickBuilder?.(row.original);
											}}
										>
											{row.getVisibleCells().map((cell) => {
												const meta = cell.column.columnDef.meta as ColumnMeta<TData> | undefined;
												return (
													<TableCell
														key={cell.id}
														className={cn(
															meta?.align === "right" && "text-right",
															meta?.align === "center" && "text-center",
															meta?.className,
														)}
													>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				{!disablePagination && (
					<div className={cn("flex items-center justify-between py-4", globalClassName)}>
						<div className="text-muted-foreground text-sm">
							Showing {table.getRowModel().rows.length} of {data.length} entries
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className={cn(globalClassName)}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className={cn(globalClassName)}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

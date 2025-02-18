"use client";

import type { ColumnConfig, ColumnMeta } from "@/components/common/common";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function createColumns<T extends object>(config: {
	columns: ColumnConfig<T>[];
}): ColumnDef<T>[] {
	return config.columns.map((column) => ({
		accessorKey: column.accessorKey as string,
		header: ({ column: tableColumn }) => {
			if (column.enableSorting) {
				return (
					<Button
						variant="ghost"
						onClick={() => tableColumn.toggleSorting(tableColumn.getIsSorted() === "asc")}
					>
						{column.header}
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
			return column.header;
		},
		cell:
			column.cell ||
			(({ row }) => {
				const value = row.getValue(String(column.accessorKey));

				return <div>{String(value)}</div>;
			}),

		size: typeof column.width === "number" ? column.width : undefined,
		minSize: typeof column.minWidth === "number" ? column.minWidth : undefined,
		maxSize: typeof column.maxWidth === "number" ? column.maxWidth : undefined,
		meta: {
			align: column.align,
			className: column.className,
			abreviation: column.abreviation,
		} as ColumnMeta<T>,
	}));
}

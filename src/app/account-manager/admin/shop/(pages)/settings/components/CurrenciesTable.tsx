import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import TableEmptyState from "@/components/common/TableEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { exchange_rates } from "@prisma/client";

type CurrenciesTableProps = {
	exchangeRates: exchange_rates[];
};

export async function CurrenciesTable({ exchangeRates }: CurrenciesTableProps) {
	return (
		<Table className="border">
			<TableHeader className="pointer-events-none">
				<TableRow>
					<TableHead className="w-[50px] text-xs">Id</TableHead>
					<TableHead className="w-[90px] text-xs">Updated</TableHead>
					<TableHead className="w-[70px] text-xs">From</TableHead>
					<TableHead className="w-[70px] text-xs">To</TableHead>
					<TableHead className=" text-xs">Rate</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{exchangeRates.map((ER) => {
					const daysAgo = Math.floor(
						(new Date().getTime() - new Date(ER.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
					);
					return (
						<TableRow key={ER.id}>
							<TableCell className="font-medium text-gray-400 text-xs">{ER.id}</TableCell>
							<TableCell
								className={cn(
									"font-medium text-xs",
									daysAgo < 1 && "text-green-400",
									daysAgo > 1 && "text-amber-500",
									daysAgo > 7 && "text-rose-300",
									daysAgo > 14 && "text-rose-500",
									daysAgo > 30 && "text-red-500",
								)}
							>
								{daysAgo > 1 ? `${daysAgo} days ago` : "today"}
							</TableCell>
							<TableCell className="font-medium text-xs">{ER.base_currency}</TableCell>
							<TableCell className="font-medium text-xs">{ER.target_currency}</TableCell>
							<TableCell className="font-medium font-mono text-xs tabular-nums">{`${ER.rate}`}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
			{exchangeRates.length === 0 && (
				<TableRow className="pointer-events-none">
					<TableCell colSpan={4}>
						<TableEmptyState />
					</TableCell>
				</TableRow>
			)}
		</Table>
	);
}

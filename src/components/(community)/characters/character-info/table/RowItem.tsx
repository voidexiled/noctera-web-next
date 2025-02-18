import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";
import type { ClassNameValue } from "tailwind-merge";

type RowItemProps = {
	shouldShow?: boolean;
	label: string;
	className?: string;
	value:
		| string
		| number
		| null
		| undefined
		| ReactNode
		| ReactNode[]
		| ((...args: unknown[]) => ReactNode);
	labelClassName?: ClassNameValue;
	valueClassName?: ClassNameValue;
};

export const RowItem: React.FC<RowItemProps> = ({
	shouldShow,
	label,
	value,
	className,
	labelClassName,
	valueClassName,
}) => {
	if (shouldShow === false) return null;
	return (
		<TableRow className={className}>
			<TableCell className={cn("w-[140px] text-card-foreground/90 text-sm", labelClassName)}>
				{label}:
			</TableCell>
			<TableCell className={cn("text-card-foreground/80 text-sm", valueClassName)}>
				{value instanceof Function ? value() : value}
			</TableCell>
		</TableRow>
	);
};

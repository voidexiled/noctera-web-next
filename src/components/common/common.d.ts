export type ColumnConfig<T> = {
	accessorKey: keyof T;
	header: string;
	enableSorting?: boolean;
	cell?: (props: { row: { original: T } }) => JSX.Element;
	width?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;
	align?: "left" | "center" | "right";
	className?: string;
	abreviation?: string;
};

export type ColumnMeta<T> = {
	align?: "left" | "center" | "right";
	className?: string;
	abreviation?: string;
};

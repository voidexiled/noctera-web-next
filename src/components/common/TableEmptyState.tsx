import { Typography } from "../Typography";

type TableEmptyStateProps = {
	title?: string;
	description?: string;
};
export default function TableEmptyState({
	title = "No items",
	description = "No data available at this time.",
}: TableEmptyStateProps) {
	return (
		<div className="flex flex-col items-center space-y-1 py-2">
			<Typography variant={"overline"}>{title}</Typography>
			<Typography variant={"body2"}>{description}</Typography>
		</div>
	);
}

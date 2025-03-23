import { Typography } from "@/components/Typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GuildTitleProps = {
	title: string | ReactNode | ReactNode[];
	className?: HTMLDivElement["className"];
	titleClassName?: HTMLDivElement["className"];
};
export const GuildTitle = ({ title, className, titleClassName }: GuildTitleProps) => {
	return (
		<div className={cn("flex flex-col justify-center", className)}>
			<Typography variant="h3" className={cn("font-bold text-2xl", titleClassName)}>
				{title}
			</Typography>
		</div>
	);
};

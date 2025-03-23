import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const CustomCard = ({
	children,
	className,
}: { children: ReactNode; className?: string }) => {
	return (
		<div className={cn("rounded-sm border", className)}>
			<div className="`transition-all transform duration-300 ease-in-out">{children}</div>
		</div>
	);
};

export const CustomCardHeader = ({
	children,
	className,
}: { children: ReactNode; className?: string }) => {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b bg-background p-2 text-sm ",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const CustomCardContent = ({
	children,
	className,
}: { children: ReactNode; className?: string }) => {
	return <div className={cn("p-2", className)}>{children}</div>;
};

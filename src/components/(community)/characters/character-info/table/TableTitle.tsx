import type { PlayerJoinGuildMembershipAndAccount } from "@/components/(community)/characters/types/character";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export const TableTitle: React.FC<ComponentPropsWithoutRef<"div">> = ({ className, children }) => {
	return (
		<div className={cn("flex items-start justify-start bg-background p-2", className)}>
			{children}
		</div>
	);
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_ADMIN_BATTLEPASS_PATH = "/account-manager/admin/battlepass";
export const BattlepassNav = () => {
	const pathname = usePathname();

	const partes = pathname.split("/");
	const selectedPath = partes[4];
	selectedPath;

	function shouldBeActive(path: string) {
		return selectedPath === path;
	}

	return (
		<nav className="flex items-center space-x-4 border-b p-2 lg:space-x-6">
			<Link
				href={BASE_ADMIN_BATTLEPASS_PATH}
				className={`font-medium text-sm transition-colors hover:text-accent ${["rewards", "tasks"].includes(selectedPath) && "text-muted-foreground/70"}`}
			>
				Seasons
			</Link>
			<Link
				href={BASE_ADMIN_BATTLEPASS_PATH.concat("/rewards")}
				className={`font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "rewards" && "text-muted-foreground/70"}`}
			>
				Rewards
			</Link>
			<Link
				href={BASE_ADMIN_BATTLEPASS_PATH.concat("/tasks")}
				className={`font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "tasks" && "text-muted-foreground/70"}`}
			>
				Tasks
			</Link>
		</nav>
	);
};

"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const BASE_ADMIN_PATH = "/account-manager/admin";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	const partes = pathname.split("/");

	const selectedPath = partes[3];
	//	const lastPath = partes[partes.length - 1];

	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}
		>
			<Link
				href={BASE_ADMIN_PATH}
				className={`font-medium text-sm transition-colors hover:text-accent ${["accounts", "shop", "blog", "battlepass", "settings"].includes(selectedPath) && "text-muted-foreground/70"}`}
			>
				Manager
			</Link>
			<Link
				href={`${BASE_ADMIN_PATH}/accounts`}
				className={`font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "accounts" && "text-muted-foreground/70"}`}
			>
				Accounts
			</Link>
			<Link
				href={`${BASE_ADMIN_PATH}/shop`}
				className={` font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "shop" && "text-muted-foreground/70"}`}
			>
				Shop
			</Link>
			<Link
				href={`${BASE_ADMIN_PATH}/blog`}
				className={`font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "blog" && "text-muted-foreground/70"}`}
			>
				Blog
			</Link>
			<Link
				href={`${BASE_ADMIN_PATH}/battlepass`}
				className={cn(
					"font-medium text-sm transition-colors hover:text-accent",
					selectedPath !== "battlepass" && "text-muted-foreground/70",
				)}
			>
				Battlepass
			</Link>
			<Link
				href={`${BASE_ADMIN_PATH}/settings`}
				className={`font-medium text-sm transition-colors hover:text-accent ${selectedPath !== "settings" && "text-muted-foreground/70"}`}
			>
				Settings
			</Link>
		</nav>
	);
}

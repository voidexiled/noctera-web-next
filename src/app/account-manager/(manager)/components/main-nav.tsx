import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-4", className)}
			{...props}
		>
			<Link
				href="/account-manager"
				className="font-medium text-sm transition-colors hover:text-primary"
			>
				Dashboard
			</Link>
			<Link
				href="/account-manager/characters"
				className="font-medium text-muted-foreground text-sm transition-colors hover:text-primary"
			>
				Character
			</Link>
			<Link
				href="/account-manager/shop"
				className="font-medium text-muted-foreground text-sm transition-colors hover:text-primary"
			>
				Shop
			</Link>
			<Link
				href="/account-manager/tickets"
				className="font-medium text-muted-foreground text-sm transition-colors hover:text-primary"
			>
				Tickets
			</Link>
		</nav>
	);
}

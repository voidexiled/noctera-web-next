import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground shadow-sm py-0.5 px-1.5",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
				outline: "text-foreground",

				success: "border-transparent bg-green-100 text-green-600",
				error: "border-transparent bg-red-100 text-red-600",
				warning: "border-transparent bg-yellow-100 text-yellow-600",
				info: "border-transparent bg-blue-100 text-blue-600",

				vip: "border-transparent bg-green-600 text-green-200",
				novip: "border-transparent bg-rose-600 text-rose-200",

				serveron: "border-transparent bg-teal-200 text-teal-700",
				serveroff: "border-transparent bg-rose-200 text-rose-700",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

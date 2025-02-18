import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 duration-150 delay-0 hover:cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-primary text-foreground shadow hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-transparent shadow-sm hover:bg-accent hover:text-foreground",
				secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				blue: "bg-[#4681f4] text-primary-foreground shadow-sm hover:bg-[#4681f4]/90",
				green: "bg-green-600 text-primary-foreground shadow-sm hover:bg-green-600/90",
				itemchild: "bg-card/70 text-foreground hover:bg-background/80",
				login:
					"bg-linear-60 text-foreground from-purple-900 to-rose-900 hover:from-purple-800 hover:to-rose-800 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				register:
					"bg-linear-60 text-foreground from-teal-900 to-blue-900 hover:from-teal-800 hover:to-blue-800 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				download:
					"bg-linear-60 text-foreground from-emerald-700 to-lime-700 hover:from-emerald-600 hover:to-lime-600 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				myaccount:
					"bg-linear-60 text-foreground from-cyan-700 to-indigo-700 hover:from-cyan-600 hover:to-indigo-600 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				logout:
					"bg-linear-60 text-foreground from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				adminpanel:
					"bg-linear-60 text-foreground from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-md hover:scale-[1.012] active:scale-[0.975] duration-150 ease-out transition-all",
				rose: "bg-rose-500 text-primary-foreground shadow-sm hover:bg-rose-400/90",
			},
			size: {
				default: "h-9 px-4 py-2",
				xs: "h-7 px-2 text-xs",
				sm: "h-8 px-3 text-xs",
				base: "h-9 px-3 text-sm",
				lg: "h-10 px-8",
				icon: "h-9 w-9",
				iconsm: "h-6 w-6",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };

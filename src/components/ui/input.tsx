import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, helperText, ...props }, ref) => {
		return (
			<div className="w-full">
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-gray-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:focus-visible:ring-accent dark:placeholder:text-gray-400 ",
						className,
					)}
					ref={ref}
					{...props}
				/>

				{error && <div className="text-red-400 text-xs">{helperText}</div>}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };

import type React from "react";
import type { ComponentPropsWithoutRef } from "react";

type TransparentContainerProps<T extends React.ElementType> = {
	as?: T;
	children: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

export const TransparentContainer = <T extends React.ElementType = "div">({
	as,
	children,
	...props
}: TransparentContainerProps<T>) => {
	const Component = as || "div";

	return (
		<Component
			{...props}
			className={`transparent-container flex flex-col gap-1 rounded-lg bg-background/15 p-1 shadow-md backdrop-blur-sm ${props.className || ""}`}
		>
			{children}
		</Component>
	);
};

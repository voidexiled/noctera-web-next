import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
	type FieldValues,
	FormProvider as Form,
	type UseFormReturn,
} from "react-hook-form";

type Props<T extends FieldValues> = {
	children: ReactNode;
	methods: UseFormReturn<T>;
	onSubmit?: VoidFunction;
	id?: string;
} & React.HTMLAttributes<HTMLFormElement>;

export default function FormProvider<T extends FieldValues>({
	children,
	onSubmit,
	methods,
	id,
	className,
	...props
}: Props<T>) {
	return (
		<Form {...methods}>
			<form
				onSubmit={onSubmit}
				id={id}
				className={cn("grid gap-4", className)}
				{...props}
			>
				{children}
			</form>
		</Form>
	);
}

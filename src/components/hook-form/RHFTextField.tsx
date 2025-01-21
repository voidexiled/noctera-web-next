import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../ui/input";
import { Label } from "../ui/label";

type IProps = {
	name: string;
	label?: string;
	prefix?: string;
	suffix?: string;
};

type Props = IProps & InputProps;

export default function RHFTextField({ name, label, ...other }: Props) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className={cn("flex w-full flex-col gap-2")}>
					{label && (
						<Label htmlFor={inputId} className="whitespace-nowrap">
							{label}
						</Label>
					)}
					<Input
						{...other}
						{...field}
						// value={field.value ?? ''}
						error={!!error}
						helperText={error?.message}
						id={inputId}
					/>
				</div>
			)}
		/>
	);
}

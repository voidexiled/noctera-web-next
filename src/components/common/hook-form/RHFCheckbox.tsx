import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type React from "react";
import { type ReactNode, useId } from "react";

type IProps = {
	name: string;
	label?: string | ReactNode | ReactNode[];
};

type Props = IProps & React.ComponentProps<typeof Checkbox>;

export default function RHFCheckbox({ name, label, ...other }: Props) {
	const { control } = useFormContext();
	const inputId = useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<div className="flex items-center space-x-2">
					<Checkbox
						id={inputId}
						onCheckedChange={field.onChange}
						{...field}
						{...other}
						defaultValue={field.value}
						checked={field.value}
					/>
					{label && (
						<Label
							htmlFor={name}
							className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{label}
						</Label>
					)}
				</div>
			)}
		/>
	);
}

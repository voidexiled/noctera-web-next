import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

type IProps = {
	name: string;
	label?: string;
};

type Props = IProps & InputProps;

export default function RHFTextarea({ name, label, ...other }: Props) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className="grid w-full gap-2">
					{label && <Label htmlFor={inputId}>{label}</Label>}
					<Textarea
						// {...other}
						{...field}
						value={field.value ?? ""}
						id={inputId}
						placeholder={other.placeholder}
					/>
				</div>
			)}
		/>
	);
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../../ui/input";
import { Label } from "../../ui/label";

type IProps = {
	name: string;
	label?: string;
	prefix?: string;
	suffix?: string;
	info?: string | ReactNode | ReactNode[];
	actionLabel?: ReactNode | ReactNode[];
};

type Props = IProps & InputProps;

export default function RHFTextField({ actionLabel, info, name, label, ...other }: Props) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className={cn("flex w-full flex-col gap-2")}>
					{label && (
						<div className=" flex w-full gap-3">
							<Label className="self-start whitespace-nowrap" htmlFor={inputId}>
								{label}
							</Label>
							{actionLabel && actionLabel}
							{info && (
								<TooltipProvider>
									<Tooltip delayDuration={100}>
										<TooltipTrigger asChild>
											<InfoCircledIcon className="h-4 w-4 self-end text-zinc-500 hover:text-zinc-400" />
										</TooltipTrigger>
										<TooltipContent className="w-80 text-xs">{info}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
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

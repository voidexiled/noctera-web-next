"use client";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Popover } from "@radix-ui/react-popover";
import React, { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

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
	const isMobile = useIsMobile();
	const { control } = useFormContext();
	const inputId = React.useId();

	console.log("isMobile", isMobile);
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className={cn("flex w-full flex-col gap-2")}>
					{label && (
						<div className="flex w-full gap-3">
							<Label className="self-start whitespace-nowrap" htmlFor={inputId}>
								{label}
							</Label>
							{actionLabel && actionLabel}
							{info &&
								(isMobile ? (
									<Popover>
										<PopoverTrigger asChild popoverTargetAction="toggle">
											<button type="button">
												<InfoCircledIcon className="h-4 w-4 self-end text-zinc-500 hover:text-zinc-400" />
											</button>
										</PopoverTrigger>
										<PopoverContent className="w-80 text-xs">{info}</PopoverContent>
									</Popover>
								) : (
									<TooltipProvider>
										<Tooltip delayDuration={100}>
											<TooltipTrigger asChild>
												<InfoCircledIcon className="h-4 w-4 self-end text-zinc-500 hover:text-zinc-400" />
											</TooltipTrigger>
											<TooltipContent className="w-80 text-xs">{info}</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								))}
						</div>
					)}
					<Input {...other} {...field} error={!!error} helperText={error?.message} id={inputId} />
				</div>
			)}
		/>
	);
}

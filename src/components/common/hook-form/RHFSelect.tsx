"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { SelectProps } from "@radix-ui/react-select";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type RHFSelectProps<T> = {
	name: string;
	options: T[];
	label?: string;
	placeholder?: string;
	defaultValue?: string | undefined;
	keyValue: keyof T;
	LabelOption: keyof T;
	info?: string | ReactNode | ReactNode[];
} & SelectProps;

export default function RHFSelect<T>({
	name,
	info,
	options,
	label,
	defaultValue,
	placeholder,
	keyValue,
	LabelOption,
	...other
}: RHFSelectProps<T>) {
	const isMobile = useIsMobile();
	const { control } = useFormContext();
	const inputId = `input-${name}`;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className="grid">
					{label && (
						<div className="mb-2 flex w-full gap-3">
							<Label className="self-start" htmlFor={inputId}>
								{label}
							</Label>
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
					<Select onValueChange={field.onChange} defaultValue={defaultValue} {...other}>
						<SelectTrigger id={inputId}>
							<SelectValue
								placeholder={placeholder ? placeholder : `Select ${name}...`}
								id="inputId"
								className={placeholder ? "opacity-20 [span]:text-gray-200" : ""}
							/>
						</SelectTrigger>
						<SelectContent className="max-h-[206px] overflow-auto">
							{options?.map((item, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<SelectItem key={index} value={item[keyValue] as string}>
									{item[LabelOption] as string}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{!!error && <div className="text-red-500 text-sm">{error?.message}</div>}
				</div>
			)}
		/>
	);
}

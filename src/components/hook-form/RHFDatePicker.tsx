import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";
import {
	Controller,
	type ControllerRenderProps,
	type FieldValues,
	useFormContext,
} from "react-hook-form";
type IProps = {
	name: string;
	label?: string;
	prefix?: string;
	suffix?: string;
};

type Props = IProps & InputProps;

export default function RHFDatePicker({ name, label, ...other }: Props) {
	const { control } = useFormContext();
	const inputId = React.useId();

	function handleTimeChange(
		field: ControllerRenderProps<FieldValues, string>,
		type: "hour" | "minute",
		value: string,
	) {
		const currentDate = field.value || new Date();

		const newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = Number.parseInt(value, 10);
			newDate.setHours(hour);
		} else if (type === "minute") {
			newDate.setMinutes(Number.parseInt(value, 10));
		}

		field.onChange(newDate);
	}

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
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-full pl-3 text-left font-normal",
									!field.value && "text-muted-foreground",
								)}
							>
								{field.value ? (
									format(field.value, "MM/dd/yyyy HH:mm")
								) : (
									<span>MM/DD/YYYY HH:mm</span>
								)}
								<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<div className="sm:flex">
								<Calendar
									mode="single"
									selected={field.value}
									onSelect={field.onChange}
									initialFocus
								/>
								<div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
									<ScrollArea className="w-64 sm:w-auto">
										<div className="flex p-2 sm:flex-col">
											{Array.from({ length: 24 }, (_, i) => i).map((hour) => (
												<Button
													key={hour}
													size="icon"
													variant={
														field?.value && field?.value?.getHours?.() === hour
															? "default"
															: "ghost"
													}
													className="aspect-square shrink-0 sm:w-full"
													onClick={() =>
														handleTimeChange(field, "hour", hour.toString())
													}
												>
													{hour}
												</Button>
											))}
										</div>
										<ScrollBar orientation="horizontal" className="sm:hidden" />
									</ScrollArea>
									<ScrollArea className="w-64 sm:w-auto">
										<div className="flex p-2 sm:flex-col">
											{Array.from({ length: 60 }, (_, i) => i).map((minute) => (
												<Button
													key={minute}
													size="icon"
													variant={
														field?.value &&
														field?.value?.getMinutes?.() === minute
															? "default"
															: "ghost"
													}
													className="aspect-square shrink-0 sm:w-full"
													onClick={() =>
														handleTimeChange(field, "minute", minute.toString())
													}
												>
													{minute.toString().padStart(2, "0")}
												</Button>
											))}
										</div>
										<ScrollBar orientation="horizontal" className="sm:hidden" />
									</ScrollArea>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			)}
		/>
	);
}

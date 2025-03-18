import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
	name: string;
	label?: string;
};

type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
	Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
		onChange?: (value: RPNInput.Value) => void;
	} & IProps;

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
	React.ElementRef<typeof RPNInput.default>,
	PhoneInputProps
>(({ name, label, className, onChange, ...props }, ref) => {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div className="grid w-full gap-2">
					<div className=" flex w-full gap-3">
						{label && <Label htmlFor={inputId}>{label}</Label>}
					</div>
					<RPNInput.default
						id={inputId}
						className={cn("flex", className)}
						flagComponent={FlagComponent}
						countrySelectComponent={CountrySelect}
						inputComponent={InputComponent}
						smartCaret={false}
						helperText
						/**
						 * Handles the onChange event.
						 *
						 * react-phone-number-input might trigger the onChange event as undefined
						 * when a valid phone number is not entered. To prevent this,
						 * the value is coerced to an empty string.
						 *
						 * @param {E164Number | undefined} value - The entered value
						 */
						//onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
						{...props}
						{...field}
					/>
					{error?.message && <div className="text-red-400 text-xs">{error.message}</div>}
				</div>
			)}
		/>
	);
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, ...props }, ref) => (
		<Input className={cn("rounded-s-none rounded-e-md", className)} {...props} ref={ref} />
	),
);
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
	disabled?: boolean;
	value: RPNInput.Country;
	options: CountryEntry[];
	onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
	disabled,
	value: selectedCountry,
	options: countryList,
	onChange,
}: CountrySelectProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="default"
					type="button"
					variant="outline"
					className="flex gap-1 rounded-s-md rounded-e-none border-r-0 px-3 focus:z-10"
					disabled={disabled}
				>
					<FlagComponent country={selectedCountry} countryName={selectedCountry} />
					<ChevronsUpDown
						className={cn("-mr-2 size-4 opacity-50", disabled ? "hidden" : "opacity-100")}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<ScrollArea className="h-72">
							<CommandEmpty>No country found.</CommandEmpty>
							<CommandGroup>
								{countryList.map(({ value, label }) =>
									value ? (
										<CountrySelectOption
											key={value}
											country={value}
											countryName={label}
											selectedCountry={selectedCountry}
											onChange={onChange}
										/>
									) : null,
								)}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
	selectedCountry: RPNInput.Country;
	onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
	country,
	countryName,
	selectedCountry,
	onChange,
}: CountrySelectOptionProps) => {
	return (
		<CommandItem className="gap-2" onSelect={() => onChange(country)}>
			<FlagComponent country={country} countryName={countryName} />
			<span className="flex-1 text-sm">{countryName}</span>
			<span className="text-foreground text-sm">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
			<CheckIcon
				className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
			/>
		</CommandItem>
	);
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};

export { PhoneInput };

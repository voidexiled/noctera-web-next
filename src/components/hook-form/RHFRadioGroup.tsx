import { randomUUID } from "node:crypto";
import Image from "next/image";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type IProps = {
	name: string;
	label: string;
	options: [{ value: string; label: string }];
};

type Props = IProps & InputProps;

export default function RHFRadioGroup({ name, label, options }: Props) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<div className="space-y-2">
					{label && <Label>{label}</Label>}
					<RadioGroup
						onValueChange={field.onChange}
						defaultValue={field.value}
						className="flex flex-col space-y-1"
					>
						{options.map((opt, index) => (
							<div
								key={String(index + 1)}
								className="flex items-center space-x-3 space-y-0"
							>
								<RadioGroupItem value={opt.value} id={inputId} />
								<Label htmlFor={inputId}>{opt.label}</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			)}
		/>
	);
}

type RHFRadioGroupItemShopProps = {
	name: string;
	options: {
		title: string;
		id: number;
		price: string;
		currency: string;
		img_url: string;
	}[];
	defaultValue?: string;
};

export function RHFRadioGroupItemShop({
	name,
	options = [],
}: RHFRadioGroupItemShopProps) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<RadioGroup
					onValueChange={field.onChange}
					defaultValue={field.value}
					className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-5"
				>
					{options.map((opt, i) => {
						return (
							<div
								key={opt.id}
								className="h-[150px] w-[150px] bg-[url('/shop/serviceid_icon_normal.png')]"
							>
								<div className="flex h-[150px] w-[150px] flex-col items-center justify-between hover:bg-[url('/shop/serviceid_icon_over.png')]">
									<RadioGroupItem
										value={opt.id.toString()}
										id={i.toString()}
										className="peer sr-only absolute"
									/>
									<Label
										htmlFor={i.toString()}
										className="absolute flex h-[150px] w-[150px] cursor-pointer flex-col peer-disabled:bg-[url('/shop/serviceid_deactivated.png')] peer-data-[state=checked]:bg-[url('/shop/serviceid_icon_selected.png')] [&:has([data-state=checked])]:bg-[url('/shop/serviceid_icon_selected.png')]"
									/>
									<div className="pt-[18px] text-[10px] text-white">
										{opt.title}
									</div>
									<Image src={opt.img_url} width={128} height={64} alt={""} />
									<div className="pb-[8px] text-[10px] text-white">
										{opt.price} {opt.currency} *
									</div>
								</div>
							</div>
						);
					})}
				</RadioGroup>
			)}
		/>
	);
}

type RHFRadioGroupPaymentProps = {
	name: string;
	options: { title: string; value: string; img_url: string }[];
	defaultValue?: string;
};
export function RHFRadioGroupPayments({
	name,
	options,
}: RHFRadioGroupPaymentProps) {
	const { control } = useFormContext();
	const inputId = React.useId();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<RadioGroup
					onValueChange={field.onChange}
					defaultValue={field.value}
					className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-5"
				>
					{options.map((opt) => (
						<>
							<div
								className="h-[147px] w-[150px] bg-[url('/shop/pmcid_icon_normal.png')] "
								key={opt.title}
							>
								<div className="flex h-[147px] w-[150px] flex-col hover:bg-[url('/shop/pmcid_icon_over.png')]">
									<RadioGroupItem
										value={opt.value}
										id={inputId}
										className="peer sr-only absolute"
									/>
									<Label
										htmlFor={inputId}
										className="absolute flex h-[147px] w-[150px] cursor-pointer flex-col peer-disabled:bg-[url('/shop/serviceid_deactivated.png')] peer-data-[state=checked]:bg-[url('/shop/pmcid_icon_selected.png')] [&:has([data-state=checked])]:bg-[url('/shop/pmcid_icon_selected.png')]"
									/>
									<div className="flex h-[147px] w-[150px] flex-col items-center pt-[24px] ">
										<Image
											src={"/payments/paymentmethodcategory31.gif"}
											width={69}
											height={23}
											alt={""}
											className="pt-14px"
										/>
										<div className="mt-6 text-[10pt] text-white text-xs">
											{opt.title}
										</div>
										<div className="mt-4 text-center text-[8pt] text-gray-400">
											<div className="">User Process time:</div>
											<div>fast</div>
										</div>
									</div>
								</div>
							</div>
						</>
					))}
				</RadioGroup>
			)}
		/>
	);
}

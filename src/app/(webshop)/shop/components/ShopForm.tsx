"use client";
import { Payment } from "@/app/(webshop)/shop/components/Payment";
import { ShopContext } from "@/app/(webshop)/shop/components/ShopContext";
import { Step, StepFormContext } from "@/app/(webshop)/shop/components/StepFormContext";
import { countries } from "@/app/account-manager/(manager)/components/data/countries";
import { Typography } from "@/components/Typography";
import { IconiFy } from "@/components/common/Iconify";
import { FormProvider, RHFSelect } from "@/components/common/hook-form";
import { RHFRadioGroupItemShop } from "@/components/common/hook-form/RHFRadioGroup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { accounts, exchange_rates, products, products_categories } from "@prisma/client";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { type PaymentIntent, loadStripe } from "@stripe/stripe-js";
import { use, useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { boolean, z } from "zod";

type ShopFormProps<T> = {
	products: products[];
	productCategories: products_categories[];
	paymentMethods: string[];
	userAccount: T;
	exchangeRate: {
		rate: number;
		base_currency: string;
		target_currency: string;
		updatedAt: Date;
	} | null;
};

// TODO: SelectInput to select category -> when selectedCategory change -> filteredProducts = products filter by category

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY!);

export default function ShopForm<T>({
	products,
	productCategories,
	paymentMethods,
	userAccount,
	exchangeRate,
}: ShopFormProps<T>) {
	const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
	const [isLoading, startTransition] = useTransition();
	const { formStep, nextFormStep, previousFormStep, resetFormSteps, errorMessage } =
		use(StepFormContext);
	const {
		selectedCategory,
		filteredProducts,
		selectedProduct,
		setSelectedCategory,
		setFilteredProducts,
		setSelectedProduct,
		confirmPaymentCallback,
	} = use(ShopContext);

	// convert categories to array of string so we can use it in zod schema as enum
	const arrayCategories = productCategories.map((p) => p.id.toString()) as [string, ...string[]];

	const ShopStepFormSchema = z.object({
		product: z.string(),
		payment: z.string(),
		category: z.enum(arrayCategories),
		terms: boolean().default(false),
	});

	type shopStepFormValues = z.infer<typeof ShopStepFormSchema>;

	console.log(arrayCategories[0]);
	const methods = useForm<shopStepFormValues>({
		resolver: zodResolver(ShopStepFormSchema),
		defaultValues: {
			category: arrayCategories[0],
		},
	});

	const {
		reset,
		handleSubmit,
		watch,
		setValue,
		formState: { isSubmitting },
	} = methods;

	const values = watch();

	const handleReset = () => {
		resetFormSteps(); // reset steps to update ui
		setPaymentIntent(null);
		setSelectedProduct(filteredProducts[0]);
		setSelectedCategory(productCategories[0]);
		reset({
			product: filteredProducts[0].id.toString(),
			category: productCategories[0].id.toString(),
		}); // reset form
	};

	function handleBackResetButtonText() {
		if (formStep > Step.PRODUCTS) return "Back";
		return "Reset";
	}

	function handlePayNextButtonText() {
		return "Next";
	}

	function handleBackResetButtonOnClick() {
		if (formStep > Step.PRODUCTS) {
			startTransition(() => previousFormStep());
		} else {
			handleReset();
		}
	}

	function handlePayNextButtonOnClick() {
		if (formStep === Step.PRODUCTS) {
			handlePaymentIntent().then((res) => {
				nextFormStep();
			});
		}
	}

	function formatSubCurrency(price: number) {
		return price * 100;
	}

	function fixedPriceText(price: number) {
		return `${Math.round(exchangeRate ? price * +exchangeRate.rate : price).toFixed(2)}`;
	}

	function fixedStripeAmount(price: number) {
		const ratedAmount = Math.round(exchangeRate ? +price * +exchangeRate.rate : +price);

		return formatSubCurrency(ratedAmount);
	}

	async function onSubmit(data: shopStepFormValues) {
		console.log("onSubmit", data);
	}

	useEffect(() => {}, [selectedProduct]);

	async function handlePaymentIntent() {
		if (!selectedProduct) {
			if (paymentIntent) setPaymentIntent(null);
			return;
		}
		await toast
			.promise(
				fetch("/api/shop/stripe/paymentIntents/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						currency_code: exchangeRate?.target_currency ?? "USD",
						value: fixedStripeAmount(+selectedProduct.price),
						description: selectedProduct.title,
						product_category_id: selectedCategory?.id,
						product_amount: selectedProduct.quantity,
					}),
				}),
				{
					loading: "Verifying order...",
					success: "Order ready",
				},
			)
			.unwrap()
			.then((res) => res.json())
			.then((res) => {
				console.log("updateing clientSecret", res.clientSecret);
				setPaymentIntent(res.paymentIntent);
				return res;
			});
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} id="payment-form">
			<div className="rounded-sm border">
				<div className="`transition-all transform duration-300 ease-in-out">
					<div className="flex items-center justify-between border-b bg-background p-2 text-sm ">
						<div className="flex items-center gap-2">
							<IconiFy icon={"healthicons:money-bag-outline"} />
							Select Product
						</div>
						{formStep > Step.PRODUCTS && (
							<IconiFy icon={"ph:check-circle"} className="text-green-600" />
						)}
					</div>
					{formStep === Step.PRODUCTS && (
						<>
							<div className="p-2 pb-0">
								<RHFSelect
									name="Category"
									LabelOption={"label"}
									keyValue={"value"}
									defaultValue={watch("category")}
									options={productCategories.map((c) => {
										return { label: c.name, value: c.id.toString() };
									})}
									onValueChange={(v) => {
										reset();
										console.log(v);
										setValue("category", v);
										const findedCategory = productCategories.find((c) => c.id === +v);
										if (findedCategory) setSelectedCategory(findedCategory);
									}}
								/>
							</div>

							<RHFRadioGroupItemShop
								name="product"
								options={filteredProducts
									.map((product) => ({
										...product,
										price: fixedPriceText(+product.price),
										currency: exchangeRate?.target_currency.toUpperCase() ?? "USD",
									}))
									.toSorted((a, b) => a.quantity! - b.quantity!)}
								defaultValue={watch("product")}
								onChange={(e) => {
									const findedProduct = filteredProducts.find((p) => p.id === +e);
									if (findedProduct) setSelectedProduct(findedProduct);
								}}
							/>
						</>
					)}
				</div>

				<div className="flex items-center justify-between border-t border-b bg-background p-2 text-sm">
					<div className="flex items-center gap-2">
						<IconiFy icon={"fluent:payment-28-regular"} />
						Checkout
					</div>
					{formStep > Step.PRODUCTS && (
						<IconiFy icon={"ph:check-circle"} className="text-green-600" />
					)}
				</div>

				{selectedProduct && paymentIntent && formStep === Step.CHECKOUT && (
					<div className="p-3">
						<Elements
							stripe={stripePromise}
							options={{
								mode: "payment",
								amount: fixedStripeAmount(+selectedProduct.price),
								currency: exchangeRate ? exchangeRate.target_currency : "USD",
								appearance: {
									theme: "night",
									labels: "floating",
									variables: {},
								},
							}}
						>
							<Payment paymentIntent={paymentIntent} account={userAccount as accounts} />
						</Elements>
						{errorMessage && (
							<div className="w-full pt-2 text-center text-rose-400 text-xs">{errorMessage}</div>
						)}
					</div>
				)}
			</div>

			{/* BOTTOM BUTTONS */}

			<div className="flex justify-end gap-2">
				{/* // ? Sould be disabled if payment confirmation is in progress */}
				<Button variant="outline" type="button" onClick={handleBackResetButtonOnClick}>
					{handleBackResetButtonText()}
				</Button>

				{/* // ? Button to send confirm payment to stripe */}
				<Button
					variant="green"
					type="button"
					className={cn("transtion-all duration-300 ease-out")}
					disabled={formStep >= Step.CHECKOUT || isLoading || !selectedProduct}
					onClick={handlePayNextButtonOnClick}
				>
					{handlePayNextButtonText()}
				</Button>
			</div>
		</FormProvider>
	);
}

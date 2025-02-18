"use client";
import type { ShopProduct } from "@/app/(webshop)/shop/shop";
import RHFCheckbox from "@/components/common/hook-form/RHFCheckbox";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { payments } from "@paypal/checkout-server-sdk";
import {
	AddressElement,
	CardElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { UseFormHandleSubmit } from "react-hook-form";
import { toast } from "sonner";

type CheckoutProps = {
	selectedProduct: ShopProduct;
	session: Session | null;
	handleResetAction: () => void;
};

export const Checkout = ({ selectedProduct, session, handleResetAction }: CheckoutProps) => {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [clientSecret, setClientSecret] = useState("");
	const stripe = useStripe();
	const elements = useElements();

	async function onSubmit() {
		setIsLoading(true);

		if (!stripe || !elements) {
			return;
		}

		const { error: submitError, selectedPaymentMethod } = await elements.submit();

		if (submitError?.message) {
			console.log("Error submitting elements", submitError);
			setErrorMessage(submitError.message);
			setIsLoading(false);
			return;
		}

		const { error } = await stripe.confirmPayment({
			elements: elements,
			clientSecret: clientSecret,
			confirmParams: {
				return_url: `${window.location.origin}/shop`,
			},
		});

		if (error?.message) {
			console.log("Error confirming payment", error);
			setErrorMessage(error?.message);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		toast
			.promise(
				fetch("/api/shop/stripe/checkout/session/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						currency_code: "mxn",
						value: convertToSubCurrency(selectedProduct.price),
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
				setClientSecret(res.clientSecret);
			});
	}, [selectedProduct.price, selectedProduct.currency]);

	useEffect(() => {
		console.log("Checkout state of clientSecret changed to ", clientSecret);
	}, [clientSecret]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button disabled={!clientSecret}>Checkout</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm your order</DialogTitle>
				</DialogHeader>
				<div className="rounded-sm border">
					<Table>
						<TableBody>
							<TableRow>
								<TableCell className="w-[130px]">Service</TableCell>
								<TableCell>{selectedProduct?.title}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Price</TableCell>
								<TableCell>
									{selectedProduct.price} {selectedProduct.currency}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Country</TableCell>
								<TableCell>MX</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>E-Mail Address</TableCell>
								<TableCell>{session?.user.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={2}>
									<div className="flex items-center gap-2">
										<RHFCheckbox name="terms" />
										<label htmlFor="terms" className="cursor-pointer">
											{" "}
											I have read and I agree to the{" "}
											<Link href={"#"} className="text-blue-500 hover:underline">
												Extended Tibia Service Agreement
											</Link>{" "}
											and the{" "}
											<Link href={"#"} className="text-blue-500 hover:underline">
												Tibia Privacy Policy
											</Link>
											.
										</label>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div className="mt-2 rounded-sm border p-3">
					{/* PAYMENTELEMENT */}
					{clientSecret && (
						<PaymentElement
							onLoadError={(e) => {
								console.log(e);
							}}
							onReady={(e) => {
								console.log(e);
							}}
							onBlur={(e) => {
								console.log(e);
							}}
							onChange={(e) => {
								console.log(e);
							}}
							onLoaderStart={(e) => {
								console.log(e);
							}}
							options={{
								layout: {
									type: "accordion",
								},
							}}
						/>
					)}
					{errorMessage && (
						<div className="w-full pt-2 text-center text-rose-400 text-xs">{errorMessage}</div>
					)}
				</div>
				<DialogFooter>
					<Button disabled={isLoading} onClick={handleResetAction} variant={"outline"}>
						Cancel
					</Button>
					<Button
						variant="login"
						className="px-3"
						disabled={!stripe || isLoading}
						type="submit"
						onClick={(e) => onSubmit()}
					>
						{!isLoading ? "Pay" : "Processing..."}
					</Button>

					{/* <PayPalButtons
														style={{
															layout: "horizontal",
															color: "black",
															height: 32,
														}}
														disabled={isSubmitting || !watch("terms")}
														createOrder={async () => {
															const res = await fetch("/api/shop/paypal/orders", {
																method: "POST",
																headers: {
																	"Content-Type": "application/json",
																},
																body: JSON.stringify({
																	productId: +watch("product"),
																	currency_code: selectedProduct.currency,
																	value: selectedProduct.price,
																	description: selectedProduct?.title,
																}),
															});
															const order = await res.json();
															order;
															return order.id;
														}}
														onApprove={async (data, actions) => {
															try {
																const response = await fetch(
																	`/api/shop/paypal/orders/${data.orderID}/capture`,
																	{
																		method: "post",
																		body: JSON.stringify({
																			type: watch("category"),
																			quantity: selectedProduct.quantity,
																		}),
																	},
																);

																const orderData = await response.json();
																// Three cases to handle:
																//   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
																//   (2) Other non-recoverable errors -> Show a failure message
																//   (3) Successful transaction -> Show confirmation or thank you message

																const errorDetail = orderData?.details?.[0];

																if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
																	// (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
																	// recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
																	return actions.restart();
																	// biome-ignore lint/style/noUselessElse: <explanation>
																} else if (errorDetail) {
																	// (2) Other non-recoverable errors -> Show a failure message
																	throw new Error(
																		`${errorDetail.description} (${orderData.debug_id})`,
																	);
																	// biome-ignore lint/style/noUselessElse: <explanation>
																} else if (!orderData.purchase_units) {
																	throw new Error(JSON.stringify(orderData));
																	// biome-ignore lint/style/noUselessElse: <explanation>
																} else {
																	// (3) Successful transaction -> Show confirmation or thank you message
																	// Or go to another URL:  actions.redirect('thank_you.html');
																	const transaction =
																		orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
																		orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
																	route.push("/account-manager/payments-history");
																	toast.success(
																		`Added ${selectedProduct.quantity} ${watch("category") === "premdays" ? "premium days" : "transferable coins"}`,
																		{
																			description: `Transaction ${transaction.status}: ${transaction.id}`,
																		},
																	);
																}
															} catch (error) {
																console.error(error);
																toast.error("Sorry, your transaction could not be processed...", {
																	description: `${error}`,
																});
															}
														}}
														onCancel={async (data, actions) => {
															toast.promise(
																fetch(`/api/shop/paypal/orders/${data.orderID}/cancel`, {
																	method: "post",
																}),
																{
																	loading: "Cancelling payment order...",
																	success: `Payment ${data.orderID} order cancelled`,
																},
															);
														}}
													/> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

function convertToSubCurrency(price: number) {
	return price * 100;
}

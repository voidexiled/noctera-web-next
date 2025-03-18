"use client";
import { ShopContext } from "@/app/(default)/(webshop)/donate/components/ShopContext";
import { StepFormContext } from "@/app/(default)/(webshop)/donate/components/StepFormContext";
import { formatCurrency } from "@/app/(default)/(webshop)/donate/utils/functions";
import { API_ROUTES } from "@/app/api/routes";
import type {
	ShopOrdersUpdateStatusPOSTRequest,
	ShopOrdersUpdateStatusPOSTResponse,
} from "@/app/api/types";
import { countries } from "@/components/(account-manager)/(manager)/data/countries";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { typedFetch } from "@/utils/typedFetch";
import { ORDER_STATUS, type accounts, type orders } from "@prisma/client";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { use, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type PaymentProps = {
	paymentIntent: PaymentIntent;
	account: accounts;
};

export function Payment({ paymentIntent, account }: PaymentProps) {
	//const [localPaymentIntentId, setLocalPaymentIntentId] = useState<string | null>(null);
	//const [localPaymentIntent, setLocalPaymentIntent] = useState<PaymentIntent | null>(null);
	const [terms, setTerms] = useState(false);
	const { data: session, status } = useSession();
	const [isLoading, startTransition] = useTransition();
	const { selectedProduct } = use(ShopContext);
	const stripe = useStripe();
	const elements = useElements();
	const { setErrorMessage } = use(StepFormContext);

	async function confirmStripePayment() {
		startTransition(async () => {
			console.log("confirming payment");
			if (!stripe || !elements || !paymentIntent.client_secret) {
				return;
			}

			const { error: submitError } = await elements.submit();

			if (submitError?.message) {
				console.log("Error submitting elements", submitError);
				setErrorMessage(submitError.message);
				return;
			}

			// ORDER -> PROCESSING

			toast
				.promise(
					typedFetch<ShopOrdersUpdateStatusPOSTRequest, ShopOrdersUpdateStatusPOSTResponse>(
						API_ROUTES.shop.orders.updateStatus._,
						{
							method: "POST",
							body: {
								paymentIntentId: paymentIntent.id,
								paymentIntentClientSecret: paymentIntent.client_secret,
								newStatus: ORDER_STATUS.PROCESSING,
							},
						},
					),
					{
						loading: "Processing order...",
						success: "Order status updated!",
						error: "Failed to process order. Try again later.",
					},
				)
				.unwrap()
				.catch((e) => {
					const error: Error = e as Error;
					console.log("Error confirming payment", error);
					setErrorMessage(error?.message);
					return e;
				});

			const { error } = await stripe
				.confirmPayment({
					elements: elements,
					clientSecret: paymentIntent.client_secret,
					confirmParams: {
						return_url: `${window.location.origin}/shop/success`,
						receipt_email: session?.user.email,
					},
				})
				.then(async (res) => {
					// if (!res.error.message) {
					// 	console.log("payment confirmed");
					// 	// send coins to account and update order status
					// 	const sendCoinsRes = await fetch("/api/shop/orders/update_status", {
					// 		method: "POST",
					// 		headers: {
					// 			"Content-Type": "application/json",
					// 		},
					// 		body: JSON.stringify({
					// 			paymentIntentId: paymentIntent.id,
					// 			paymentIntentClientSecret: paymentIntent.client_secret,
					// 			newStatus: "DELIVERED",
					// 		}),
					// 	});

					// 	if (sendCoinsRes.status === 200) {
					// 		const sendCoinsResData: orders = await sendCoinsRes.json();
					// 		toast.success(
					// 			`${sendCoinsResData.product_amount} Noctera Coins added to your account!`,
					// 		);
					// 	}
					// }
					return res;
				});

			if (error?.message) {
				console.log("Error confirming payment", error);
				setErrorMessage(error?.message);
			}
		});
	}
	// // ? TODO: GET ORDER TO GET PRODUCT PRICE, DESCRIPTION AND AMOUNT
	// useEffect(() => {
	// 	const timeoutId = setTimeout(() => {
	// 		toast
	// 			.promise(
	// 				fetch("/api/shop/stripe/paymentIntents/get", {
	// 					method: "POST",
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 					},
	// 					body: JSON.stringify({
	// 						paymentIntentId: paymentIntent.id,
	// 						paymentIntentClientSecret: paymentIntent.client_secret,
	// 					}),
	// 				}),
	// 				{
	// 					loading: "Verifying order...",
	// 					success: "Order verified!",
	// 					error: "Failed to verify order. Try again later.",
	// 				},
	// 			)
	// 			.unwrap()
	// 			.then(async (res) => {
	// 				if (res.status === 200) {
	// 					const resData: {
	// 						paymentIntent: PaymentIntent;
	// 					} = await res.json();
	// 					console.log("received payment intent", resData);
	// 					setLocalPaymentIntent(resData.paymentIntent);
	// 				}
	// 			});
	// 	}, 500);
	// 	return () => clearTimeout(timeoutId);
	// }, [paymentIntent.id, paymentIntent.client_secret]);

	// useEffect(() => {
	// 	console.log("localPaymentIntent", localPaymentIntent);
	// 	if (localPaymentIntent) setLocalPaymentIntentId(localPaymentIntent.id);
	// }, [localPaymentIntent]);

	// if (!localPaymentIntent || !localPaymentIntentId) return <></>;

	return (
		<>
			<PaymentElement />

			<Table className="mt-7 border">
				<TableHeader>
					<TableRow>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Country</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>{session?.user.email}</TableCell>
						<TableCell>{account.phone}</TableCell>
						<TableCell>
							{
								countries.find((c) => c.value.toUpperCase() === account.country.toUpperCase())
									?.label
							}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Table className="mt-2 border">
				<TableHeader>
					<TableRow>
						<TableCell>Reward</TableCell>
						<TableCell>Donation</TableCell>
						<TableCell>Currency</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>{selectedProduct?.title}</TableCell>
						<TableCell>
							{formatCurrency(paymentIntent.amount / 100, paymentIntent.currency)}
						</TableCell>
						<TableCell>{paymentIntent.currency.toUpperCase()}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<div className="mt-3 text-pretty border border-rose-500 bg-rose-500/30 p-3 text-xs ">
				<p className="text-pretty text-sm">
					Please review the information about your purchase carefully. By proceeding, you
					acknowledge that you understand the details of the product you are purchasing.
				</p>
				<p className="text-pretty text-sm">
					For more information, refer to our{" "}
					<Link href="/terms" className="text-blue-500">
						Terms and Conditions
					</Link>{" "}
					page. You can also read about our{" "}
					<Link href="/terms" className="text-blue-500">
						Return Policy
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="text-blue-500">
						Privacy Policy
					</Link>
					.
				</p>
				<p className="mt-2 text-pretty text-red-600 text-xs">
					Note: Ensure the information is correct as proceeding with incorrect details may lead to
					issues in payment and delivery.
				</p>
			</div>
			<div className="flex flex-row items-center justify-end p-4">
				<Checkbox
					checked={terms === true}
					onCheckedChange={(checked) => setTerms(checked === true)}
				/>
				<span className="ml-2 text-sm">
					I accept the{" "}
					<Link href="/terms" className="text-blue-500">
						terms and conditions
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="text-blue-500">
						privacy policy
					</Link>
					.
				</span>
			</div>
			<motion.div
				className="flex flex-row justify-end pt-1"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.35 }}
			>
				<Button
					onClick={confirmStripePayment}
					disabled={!stripe || !elements || isLoading || !terms}
				>
					{isLoading ? "Confirming..." : "Confirm payment"}
				</Button>
			</motion.div>

			{/* <AddressElement
				options={{
					mode: "billing",
					fields: {
						phone: "always",
					},
					display: {
						name: "split",
					},
				}}
			/> */}
		</>
	);
}

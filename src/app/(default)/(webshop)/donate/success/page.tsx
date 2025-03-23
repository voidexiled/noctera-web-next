import { ErrorMesssage } from "@/app/(default)/(webshop)/donate/success/components/ErrorMessage";
import { SuccessMessage } from "@/app/(default)/(webshop)/donate/success/components/SuccessMessage";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { deliverOrder } from "@/services/orders/OrdersService";
import type { orders } from "@prisma/client";
import { redirect } from "next/navigation";

import Stripe from "stripe";

type SearchParams = Promise<{
	payment_intent: string;
	payment_intent_client_secret: string;
	redirect_status: string;
}>;
//

const stripe = new Stripe(`${process.env.TEST_STRIPE_SECRET_KEY}`, {
	apiVersion: "2025-01-27.acacia",
	typescript: true,
	telemetry: false,
});
export default async function ShopSuccessPage(props: { searchParams: SearchParams }) {
	const searchParams = await props.searchParams;

	const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);
	console.log(paymentIntent);

	const order = await prisma.orders.findFirst({
		where: { orderID: paymentIntent.id },
	});

	if (paymentIntent.client_secret && paymentIntent.status === "succeeded" && order) {
		console.log("Payment was successful");
		//
	}
	//const customerId = paymentIntent.customer;

	if (order?.status === "PROCESSING") {
		await deliverOrder({ orderID: paymentIntent.id });
	} else {
		console.log("Order already delivered");
		redirect("/account-manager/");
	}

	return (
		<Card className="bg-background">
			<CardContent className="grid">
				<div className="m-auto flex max-w-lg flex-col items-center justify-center p-6">
					{paymentIntent.status === "succeeded" && <SuccessMessage />}
					{paymentIntent.status === "requires_payment_method" ||
						paymentIntent.status === "requires_confirmation" ||
						paymentIntent.status === "requires_action" ||
						paymentIntent.status === "processing" ||
						paymentIntent.status === "requires_capture" ||
						(paymentIntent.status === "canceled" && <ErrorMesssage />)}
				</div>
			</CardContent>
		</Card>
	);
}

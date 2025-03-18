import type {
	ShopStripePaymentIntentsCreatePOSTRequest,
	ShopStripePaymentIntentsCreatePOSTResponse,
} from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccountUnique } from "@/services/accounts/AccountsService";
import { ORDER_STATUS } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { z } from "zod";

const StripeSchema = z.object({
	currency_code: z.string(),
	value: z.number(),
	description: z.string(),
	product_category_id: z.number(),
	product_amount: z.number(),
});

const stripe = new Stripe(`${process.env.TEST_STRIPE_SECRET_KEY}`, {
	apiVersion: "2025-01-27.acacia",
	typescript: true,
	telemetry: false,
});

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const data: ShopStripePaymentIntentsCreatePOSTRequest = await request.json();
		const { currency_code, value, description, product_category_id, product_amount } = data;

		// Verify user account
		const playerAccount = await getAccountUnique({
			where: { id: +session.user.id },
			select: {
				id: true,
				email: true,
			},
		});
		if (!playerAccount) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		// Create payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: value,
			currency: currency_code,
			automatic_payment_methods: {
				enabled: true,
			},
		});

		// handle payment intent creation error
		if (!paymentIntent.client_secret) {
			return NextResponse.json({ error: "Failed to create payment." }, { status: 500 });
		}

		// Simulate the order
		const order = await prisma.orders.create({
			data: {
				account_id: playerAccount.id,
				status: ORDER_STATUS.PENDING,
				provider: "stripe",
				currency: currency_code,
				total_amount: (value / 100).toString(),
				product_category_id: product_category_id,
				product_amount: product_amount,
				orderID: paymentIntent.id,
				payerID: paymentIntent.customer?.toString(),
				paymentClientSecret: paymentIntent.client_secret, // ! TODO: delete???
				description: description,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		let orderCreated = false;

		if (order) {
			orderCreated = true;
		}

		const response: ShopStripePaymentIntentsCreatePOSTResponse = {
			paymentIntent,
			orderCreated,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.error(err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

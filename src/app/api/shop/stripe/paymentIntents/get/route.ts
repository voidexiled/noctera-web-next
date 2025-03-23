import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import z from "zod";

const stripe = new Stripe(process.env.TEST_STRIPE_SECRET_KEY as string, {
	apiVersion: "2025-01-27.acacia",
});

const schema = z.object({
	paymentIntentId: z.string(),
	paymentIntentClientSecret: z.string(),
});

export async function POST(request: NextRequest) {
	try {
		const { paymentIntentId, paymentIntentClientSecret } = schema.parse(await request.json());
		console.log(paymentIntentId);
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "No session found" }, { status: 401 });
		console.log(session);
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId).catch((err) => {
			console.log(err);
			return err;
		});
		console.log(paymentIntent);
		if (!paymentIntent)
			return NextResponse.json({ message: "Payment intent not found" }, { status: 404 });

		return NextResponse.json(paymentIntent);
	} catch (error) {
		return NextResponse.json({ message: "Invalid request" }, { status: 400 });
	}
}

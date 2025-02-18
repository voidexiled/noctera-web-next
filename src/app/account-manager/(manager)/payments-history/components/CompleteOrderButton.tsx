"use client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { cancelOrder, captureOrder } from "./actions";

export function CompleteOrderButton({
	paymentIntentId,
	paymentIntentClientSecret,
}: { paymentIntentId: string; paymentIntentClientSecret: string }) {
	const router = useRouter();
	return (
		<Button
			variant="green"
			className="w-full"
			onClick={() => {
				router.push(
					`/shop/success?payment_intent=${paymentIntentId}&payment_intent_client_secret=${paymentIntentClientSecret}&redirect_status=succeeded`,
				);
			}}
		>
			Complete order
		</Button>
	);
}

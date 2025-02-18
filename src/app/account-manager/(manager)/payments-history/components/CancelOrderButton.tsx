"use client";
import { Button } from "@/components/ui/button";
import { cancelOrder, captureOrder } from "./actions";

export function CancelOrderButton({ paymentIntentId }: { paymentIntentId: string }) {
	return (
		<Button
			variant="destructive"
			className="w-full"
			onClick={async () => {
				await cancelOrder({ paymentIntentId });
			}}
		>
			CANCEL
		</Button>
	);
}

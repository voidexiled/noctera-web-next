"use client";
import { cancelOrder } from "@/components/(account-manager)/(manager)/manager/payments-history/actions/actions";
import { Button } from "@/components/ui/button";

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

"use client";
import { Button } from "@/components/ui/button";
import { cancelOrder, captureOrder } from "../components/actions";

export function CancelOrderButton({ order }: { order: string }) {
	return (
		<>
			<Button
				variant={"destructive"}
				className="line-clamp-1 h-auto w-full px-2 py-1 text-left text-xs"
				onClick={async () => {
					await cancelOrder({ order });
				}}
			>
				CANCEL
			</Button>
		</>
	);
}

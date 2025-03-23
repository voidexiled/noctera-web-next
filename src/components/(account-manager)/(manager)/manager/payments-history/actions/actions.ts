"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const cancelOrder = async ({ paymentIntentId }: { paymentIntentId: string }) => {
	const queryOrder = await prisma.orders.findFirst({
		where: { orderID: paymentIntentId },
	});
	if (queryOrder) {
		await prisma.orders.delete({ where: { id: queryOrder.id } });
	}
	revalidatePath("account-manager/payments-history");
};

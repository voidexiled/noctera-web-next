import type {
	ShopOrdersUpdateStatusPOSTRequest,
	ShopOrdersUpdateStatusPOSTResponse,
} from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ORDER_STATUS } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const data: ShopOrdersUpdateStatusPOSTRequest = await request.json();
		const { paymentIntentId, paymentIntentClientSecret, newStatus } = data;

		const order = await prisma.orders.findFirst({
			where: { orderID: paymentIntentId, paymentClientSecret: paymentIntentClientSecret },
			select: {
				id: true,
				status: true,
				product_category_id: true,
				total_amount: true,
				product_amount: true,
			},
		});

		if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

		const updatedOrder = await prisma.orders.update({
			where: { id: order.id },
			data: { status: newStatus },
		});

		if (!updatedOrder)
			return NextResponse.json({ error: "Failed to update order." }, { status: 500 });

		return NextResponse.json(updatedOrder);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Failed to update order status." }, { status: 500 });
	}
}

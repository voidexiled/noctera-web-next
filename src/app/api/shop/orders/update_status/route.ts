import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validStatuses = Object.values(ORDER_STATUS) as [string, ...string[]];

const schema = z.object({
	paymentIntentId: z.string(),
	paymentIntentClientSecret: z.string(),
	newStatus: z.enum(validStatuses),
});

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const { paymentIntentId, paymentIntentClientSecret, newStatus } = schema.parse(
			await request.json(),
		);

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
			data: { status: newStatus as ORDER_STATUS },
		});

		if (!updatedOrder)
			return NextResponse.json({ error: "Failed to update order." }, { status: 500 });

		return NextResponse.json(updatedOrder);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "Failed to update order status." }, { status: 500 });
	}
}

import { prisma } from "@/lib/prisma";
import { getAccount, updateAccount } from "@/services/accounts/AccountsService";
import {
	createPlayerStoreHistory,
	updatePlayerStoreHistory,
} from "@/services/players/PlayerStoreHistoryService";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";

type GetOrderParams = {
	where?: Prisma.ordersWhereInput;
	select?: Prisma.ordersSelect;
};

export async function getOrder({ where, select }: GetOrderParams) {
	return await prisma.orders.findMany({ where, select });
}

// if (updatedOrder.status === "DELIVERED") {
//     // ! TODO: HANDLE DIFFERENT TYPES OF PRODUCT CATEGORIES
//     const account = await prisma.accounts.findFirst({
//         where: { id: +session.user.id },
//         select: {
//             id: true,
//             coins: true,
//             coins_transferable: true,
//         },
//     });
//     if (!account) return NextResponse.json({ error: "Account not found." }, { status: 500 });

//     const newAmount = account.coins_transferable + updatedOrder.product_amount;
//     await prisma.accounts.update({
//         where: { id: +session.user.id },
//         data: {
//             coins_transferable: newAmount,
//         },
//     });

//     await prisma.store_history.create({
//         data: {
//             account_id: account.id,
//             coin_type: true,
//             coin_amount: updatedOrder.product_amount,
//             description: `Deposit ${updatedOrder.product_amount} coins with Stripe`,
//             time: dayjs().unix(),
//         },
//     });
// }

export async function deliverOrder({ orderID }: { orderID: string }) {
	const order = await prisma.orders.findFirst({
		where: { orderID },
	});

	if (!order) return null;

	const userAccount = await getAccount({
		where: { id: +order.account_id },
		select: {
			id: true,
			coins_transferable: true,
		},
	});

	if (!userAccount) return null;

	const newAmount = userAccount.coins_transferable + order.product_amount;

	const updatedAccount = await updateAccount({
		where: { id: +order.account_id },
		data: {
			coins_transferable: newAmount,
		},
	});

	if (!updatedAccount) return null;

	await createPlayerStoreHistory({
		data: {
			account_id: updatedAccount.id,
			coin_type: true,
			coin_amount: order.product_amount,
			description: `Deposit ${order.product_amount} coins with Stripe`,
			time: dayjs().unix(),
		},
	});

	const updatedOrder = await prisma.orders.update({
		where: { id: order.id },
		data: { status: "DELIVERED" },
	});

	if (!updatedOrder) return null;

	return updatedOrder;
}

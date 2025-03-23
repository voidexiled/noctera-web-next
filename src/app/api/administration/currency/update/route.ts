import type { CurrencyFreaksResponseType } from "@/app/(default)/account-manager/admin/shop/(pages)/settings/components/CurrenciesActionsSection";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma, exchange_rates } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user || session.user.role !== "admin")
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const res: exchange_rates[] = await request.json();
		console.log(res);

		const updatePromises = res.map((rate) => {
			return prisma.exchange_rates.update({
				where: {
					base_currency: rate.base_currency,
					target_currency: rate.target_currency,
				},
				data: rate,
			});
		});

		const updatedResults = await Promise.allSettled(updatePromises);
		const successfulUpdates = updatedResults.filter(
			(result) => result.status === "fulfilled",
		).length;

		if (successfulUpdates === 0) {
			return NextResponse.json({ message: "No currencies updated" }, { status: 400 });
		}

		return NextResponse.json({ message: "Currency rates updated successfully!" }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error updating currency rates" }, { status: 500 });
	}
}

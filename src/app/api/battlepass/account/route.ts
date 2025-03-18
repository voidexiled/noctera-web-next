import type { BattlepassAccountPOSTRequest, BattlepassAccountPOSTResponse } from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { getAccountUnique } from "@/services/accounts/AccountsService";
import type { Prisma, accounts, player_battlepass_progress, player_battlepass_rewards_claimed, player_battlepass_tasks, players } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body: BattlepassAccountPOSTRequest = await request.json();

		const { id, season_id } = body;

		const account = await getAccountUnique({
			where: { id: +id },
			include: {
				players: {
					include: {
						player_battlepass_progress: {
							where: {
								season_id: +season_id,
							},
						},
						player_battlepass_tasks: {
							where: {
								season_id: +season_id,
							},
						},
						player_battlepass_rewards_claimed: {
							where: {
								season_id: +season_id,
							},
						},
					},
				},
			},
		});

		if (!account) {
			return NextResponse.json({
				status: 404,
				error: "Account not found",
			});
		}

		const response: BattlepassAccountPOSTResponse = {
			account,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error = e as Error;
		console.error("Error during account fetch: ", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

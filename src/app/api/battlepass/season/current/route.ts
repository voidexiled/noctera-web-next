import type { BattlepassSeasonCurrentPOSTResponse } from "@/app/api/types";
import { isDateActive } from "@/components/(battlepass)/battlepass/lib/utils";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GetCurrentSeason } from "@/services/battlepass/BattlepassService";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const currentSeason = await GetCurrentSeason({
			include: {
				battlepass_seasons_tasks: true,
				battlepass_seasons_rewards: true,
			},
		});

		if (!currentSeason) {
			return NextResponse.json({
				error: "No current season found.",
				status: 404,
			});
		}

		const response: BattlepassSeasonCurrentPOSTResponse = {
			season: currentSeason,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error = e as Error;
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

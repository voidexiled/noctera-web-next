import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getLatestKills(
	take?: number,
	orderBy?: Prisma.player_deathsOrderByWithAggregationInput,
	where?: Prisma.player_deathsWhereInput,
) {
	try {
		const latestKills = await prisma.player_deaths.findMany({
			take: take ?? 50,
			orderBy: orderBy ?? { time: "desc" },
			where: where ?? {
				is_player: true,
			},
		});
		return latestKills;
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		return [];
	}
}

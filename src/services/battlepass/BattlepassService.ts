"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export async function GetCurrentSeason<T extends Omit<Prisma.battlepass_seasonsFindFirstArgs, "where">>(args: T): Promise<Prisma.battlepass_seasonsGetPayload<T>> {
	try {
		const now = dayjs().toISOString();

		const season = await prisma.battlepass_seasons.findFirst({
			...args,
			where: {
				AND: [
					{ date_start: { lte: now } }, // date_start <= now
					{ date_end: { gte: now } }, // date_end >= now
				],
			},
		});
		console.log("BattlepassService.GetCurrentSeason: ", now, season);
		return season as Prisma.battlepass_seasonsGetPayload<T>;
	} catch (e) {
		console.error(e);
		throw e;
	}
}

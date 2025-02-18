"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getPlayerById(id: number, select?: Prisma.playersSelect) {
	try {
		const player = await prisma.players.findFirst({
			where: { id },
			select,
		});

		return player;
	} catch (err) {
		const error = err as Error;
		console.error(error);
	}
}

type GetManyPlayersParams = {
	where?: Prisma.playersWhereInput;
	select?: Prisma.playersSelect;
	orderBy?: Prisma.playersOrderByWithRelationInput;
	take?: number;
	skip?: number;
};

export async function getManyPlayers({ where, select, orderBy, take, skip }: GetManyPlayersParams) {
	try {
		const players = await prisma.players.findMany({
			where,
			select,
			orderBy,
			take,
			skip,
		});
		return players;
	} catch (err) {
		const error = err as Error;
		console.log(error.message);
	}
}

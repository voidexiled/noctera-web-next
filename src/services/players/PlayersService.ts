"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GetFirstPlayer<T extends Prisma.playersFindFirstArgs>(args: T): Promise<Prisma.playersGetPayload<T>> {
	try {
		const player = await prisma.players.findFirst(args);
		return player as Prisma.playersGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener el primer jugador:", error);
		throw error;
	}
}

export async function getPlayerById(id: number, select?: Prisma.playersSelect) {
	try {
		const player = await prisma.players.findFirst({
			where: { id },
			select,
		});

		return player;
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		throw error;
	}
}

type GetManyPlayersParams = {
	where?: Prisma.playersWhereInput;
	select?: Prisma.playersSelect;
	orderBy?: Prisma.playersOrderByWithRelationInput;
	take?: number;
	skip?: number;
};

export async function GetManyPlayers<T extends Prisma.playersFindManyArgs>(args: T): Promise<Prisma.playersGetPayload<T>[]> {
	try {
		const players = await prisma.players.findMany(args);
		return players as Prisma.playersGetPayload<T>[];
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		throw error;
	}
}

"use server";

import { prisma } from "@/lib/prisma";

export async function isPlayerOnline(player_id: number) {
	const query = await prisma.players_online.findFirst({
		where: { player_id },
	});
	if (query) {
		return true;
	}
	return false;
}

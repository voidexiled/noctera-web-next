"use server";

import { prisma } from "@/lib/prisma";

export async function getGuildHall(guildId: number) {
	const guildHall = await prisma.houses.findFirst({
		where: {
			guildid: guildId,
		},
		select: {
			name: true,
			paid: true,
			guildid: true,
			owner: true,
		},
	});

	return guildHall;
}

"use server";

import { prisma } from "@/lib/prisma";
import type { boosted_boss, boosted_creature } from "@prisma/client";

export const getBoostedCreature = async (): Promise<boosted_creature | null> => {
	try {
		return await prisma.boosted_creature.findFirst();
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error fetching boosted creature:", error);
		return null;
	}
};

export const getBoostedBoss = async (): Promise<boosted_boss | null> => {
	try {
		return await prisma.boosted_boss.findFirst();
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error fetching boosted boss:", error);
		return null;
	}
};

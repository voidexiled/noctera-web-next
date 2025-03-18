"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function CreatePlayerBattlepassRewardsClaimed<T extends Prisma.player_battlepass_rewards_claimedCreateArgs>(
	args: T,
): Promise<Prisma.player_battlepass_rewards_claimedGetPayload<T>> {
	try {
		const res = await prisma.player_battlepass_rewards_claimed.create(args);
		return res as Prisma.player_battlepass_rewards_claimedGetPayload<T>;
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function GetFirstPlayerBattlepassRewardsClaimed<T extends Prisma.player_battlepass_rewards_claimedFindFirstArgs>(
	args: T,
): Promise<Prisma.player_battlepass_rewards_claimedGetPayload<T>> {
	try {
		const res = await prisma.player_battlepass_rewards_claimed.findFirst(args);
		return res as Prisma.player_battlepass_rewards_claimedGetPayload<T>;
	} catch (e) {
		console.error(e);
		throw e;
	}
}

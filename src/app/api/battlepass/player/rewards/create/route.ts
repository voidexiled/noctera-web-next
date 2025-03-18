import type { BattlepassPlayerRewardsCreatePOSTRequest, BattlepassPlayerRewardsCreatePOSTResponse } from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GetCurrentSeason } from "@/services/battlepass/BattlepassService";
import { CreatePlayerBattlepassRewardsClaimed, GetFirstPlayerBattlepassRewardsClaimed } from "@/services/players/PlayersBattlepassRewardsClaimed";
import type { player_battlepass_rewards_claimed } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body: BattlepassPlayerRewardsCreatePOSTRequest = await request.json();
		const { player_id, season_id, reward_id } = body;

		if (!player_id || !season_id || !reward_id) {
			return NextResponse.json({ error: "Missing player_id, season_id, reward_id", status: 400 });
		}

		const currentSeason = await GetCurrentSeason({
			select: {
				id: true,
			},
		});

		// not allowed claiming rewards from other seasons
		if (currentSeason?.id !== +season_id) {
			return NextResponse.json({
				status: 400,
				statusText: "You can't claim this reward",
			});
		}

		const alreadyClaimed = await GetFirstPlayerBattlepassRewardsClaimed({
			where: {
				player_id: Number(player_id),
				season_id: Number(season_id),
				reward_id: Number(reward_id),
			},
		});

		if (alreadyClaimed) {
			return NextResponse.json({
				status: 400,
				statusText: "Player battlepass reward already claimed",
			});
		}

		// Register the reward claimed
		const res = await CreatePlayerBattlepassRewardsClaimed({
			data: {
				player_id: +player_id,
				season_id: +season_id,
				reward_id: +reward_id,
				claimed_at: new Date(),
			},
		});

		if (!res) {
			return NextResponse.json({
				status: 404,
				error: "Error on claim player battlepass reward",
			});
		}
		// ! Give the player the reward

		// Error handling for giving the player reward
		const response: BattlepassPlayerRewardsCreatePOSTResponse = res;

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error = e as Error;
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

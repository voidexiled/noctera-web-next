import type { BattlepassCharacterPOSTRequest, BattlepassCharacterPOSTResponse } from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GetFirstPlayer } from "@/services/players/PlayersService";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body: BattlepassCharacterPOSTRequest = await request.json();

		const { id, season_id } = body;

		const character = await GetFirstPlayer({
			where: { id: +id },
			select: {
				name: true,
				level: true,
				id: true,
				battlepass_rank: true,
				vocation: true,
			},
			include: {
				player_battlepass_progress: {
					where: {
						season_id: +season_id,
					},
				},
				player_battlepass_tasks: {
					where: {
						season_id: +season_id,
					},
				},
				player_battlepass_rewards_claimed: {
					where: {
						season_id: +season_id,
					},
				},
			},
		});

		console.log("character: ", character);

		if (!character) {
			return NextResponse.json({
				status: 404,
				statusText: "Character not found",
			});
		}

		const response: BattlepassCharacterPOSTResponse = {
			player: character,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error during character fetch: ", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

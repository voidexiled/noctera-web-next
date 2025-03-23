import type { GuildsCharactersNameGETRequest } from "@/app/api/types";
import { prisma } from "@/lib/prisma";
import { GetManyPlayers } from "@/services/players/PlayersService";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<GuildsCharactersNameGETRequest>;

export async function GET(request: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

	const characters = await GetManyPlayers({
		where: {
			AND: [
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
				{
					name: {
						contains: params.name ? decodeURIComponent(params.name) : undefined,
					},
				},
				{ guild_membership: { is: null } },
				{ guilds: { is: null } },
			],
		},
		take: 25,
	});

	return NextResponse.json(convertBigIntsToNumbers(characters));
}

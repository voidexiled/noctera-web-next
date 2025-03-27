import type {
	GuildsManagerIdPlayerPlayerIdGETRequest,
	GuildsManagerIdPlayerPlayerIdPOSTRequest,
	GuildsManagerIdPlayerPlayerIdPOSTRequestParams,
	GuildsManagerIdPlayerPlayerIdPOSTResponse,
	GuildsManagerIdPlayerPlayerIdPUTRequest,
	GuildsManagerIdPlayerPlayerIdPUTRequestParams,
	GuildsManagerIdPlayerPlayerIdPUTResponse,
} from "@/app/api/types";
import type { InvitePlayerToGuildResponse, UpdateGuildMemberRankResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { GlobalConfig } from "@/lib/config";
import { ManageUserSession } from "@/lib/helpers/api";
import { prisma } from "@/lib/prisma";
import { GetManyGuildMemberships } from "@/services/guilds/GuildsMembershipService";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import type { players } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type ChangeRankParams = Promise<GuildsManagerIdPlayerPlayerIdPUTRequestParams>;

type InvitePlayerParams = Promise<GuildsManagerIdPlayerPlayerIdPOSTRequestParams>;

type FindPlayersParams = Promise<GuildsManagerIdPlayerPlayerIdGETRequest>;

// ChangeRank to player Route
export async function PUT(request: NextRequest, params: ChangeRankParams) {
	try {
		const bodyParams = await params;
		const body: GuildsManagerIdPlayerPlayerIdPUTRequest = await request.json();
		const { rank_id } = body;
		const { id: guild_id, player_id: playerId } = bodyParams;

		await ManageUserSession(async (session) => {
			const ownPlayersInGuild = await GetManyGuildMemberships({
				where: {
					players: {
						account_id: +session.user.id,
					},
				},
				include: {
					guild_ranks: true,
				},
			});

			// ! TODO: coleader can change ranks to players < coleader?
			const isLeader = ownPlayersInGuild.some((player) => player.guild_ranks.level === GlobalConfig.guilds.leader_rank_level);

			return isLeader;
		});

		const data = await prisma.guild_membership.update({
			where: { player_id: +playerId },
			data: { rank_id },
			select: {
				guilds: { select: { name: true } },
				players: {
					select: { name: true },
				},
				guild_ranks: {
					select: { name: true, level: true },
				},
			},
		});

		const response: GuildsManagerIdPlayerPlayerIdPUTResponse = {
			player_name: data.players.name,
			rank_name: data.guild_ranks.name,
		};

		revalidatePath(`/guilds/${data.guilds.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

// InvitePlayer to guild Route
export async function POST(request: NextRequest, params: InvitePlayerParams) {
	try {
		const body = await params;

		await ManageUserSession(async (session) => {
			const ownPlayersInGuild = await GetManyGuildMemberships({
				where: {
					guild_id: +body.id,
					players: {
						account_id: +session.user.id,
					},
				},
				include: {
					guild_ranks: true,
				},
			});

			const canInviteAPlayer = ownPlayersInGuild.some((player) => player.guild_ranks.level > GlobalConfig.guilds.permissive_invite_rank_level);

			return canInviteAPlayer;
		});

		const { id: guildId, player_id: playerId } = body;

		const validInvite = await prisma.guild_invites.findFirst({
			where: { player_id: +playerId },
		});

		if (validInvite) return NextResponse.json({ error: "Player was already invited" }, { status: 400 });

		const data = await prisma.guild_invites.create({
			data: {
				guild_id: +guildId,
				player_id: +playerId,
				date: dayjs().unix(),
			},
			select: { guilds: { select: { name: true } }, players: { select: { name: true, id: true } } },
		});

		revalidatePath(`/guilds/${data.guilds.name}`);

		const response: GuildsManagerIdPlayerPlayerIdPOSTResponse = {
			player_id: data.players.id,
			player_name: data.players.name,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

// FindPlayers availables to invite the guild Route
export async function GET(request: NextRequest, params: FindPlayersParams) {
	const { id, name } = await params;
	const characters = await prisma.players.findMany({
		where: {
			AND: [
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
				{
					name: {
						contains: name ? decodeURIComponent(name) : undefined,
					},
				},
			],
		},
	});

	const response = {
		players: convertBigIntsToNumbers(characters),
	};

	return NextResponse.json(response);
}

import type {
	InvitePlayerToGuildResponse,
	UpdateGuildMemberRankResponse,
} from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ id: string; player_id: number }>;

const ValidateUpdateRankSchema = z.object({
	rank_id: z.number(),
});

const ChangeRank = async (request: Request, { params }: { params: Params }) => {
	try {
		const { rank_id } = ValidateUpdateRankSchema.parse(await request.json());
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const playerId = (await params).player_id;
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

		revalidatePath(`/guilds/${data.guilds.name}`);
		const responseData: UpdateGuildMemberRankResponse = {
			player_name: data.players.name,
			rank_name: data.guild_ranks.name,
		};
		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

const ValidateInviteSchema = z.object({
	rank_id: z.number(),
});

const InvitePlayer = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const playerId = (await params).player_id;
		const guildId = (await params).id;

		const validInvite = await prisma.guild_invites.findFirst({
			where: { player_id: +playerId },
		});

		if (validInvite)
			return NextResponse.json({ message: "Player was already invited" }, { status: 400 });

		const data = await prisma.guild_invites.create({
			data: {
				guild_id: +guildId,
				player_id: +playerId,
				date: dayjs().unix(),
			},
			select: { guilds: { select: { name: true } }, players: { select: { name: true, id: true } } },
		});

		revalidatePath(`/guilds/${data.guilds.name}`);

		const responseData: InvitePlayerToGuildResponse = {
			player_id: data.players.id,
			player_name: data.players.name,
		};

		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

type FindParams = Promise<{ id: string; name: string }>;

const find = async (request: Request, { params }: { params: FindParams }) => {
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

	return NextResponse.json(convertBigIntsToNumbers(characters));
};

export { ChangeRank as PUT, InvitePlayer as POST, find as GET };

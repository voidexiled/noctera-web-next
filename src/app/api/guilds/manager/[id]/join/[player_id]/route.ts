import type { GuildsManagerIdJoinPlayerIdPATCHRequest, GuildsManagerIdJoinPlayerIdPATCHResponse } from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<GuildsManagerIdJoinPlayerIdPATCHRequest>;

export async function PATCH(request: NextRequest, params: Params) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body = await params;

		const { id: guildId, player_id: playerId } = body;

		const findInvite = await prisma.guild_invites.findUnique({
			where: {
				player_id_guild_id: {
					guild_id: +guildId,
					player_id: +playerId,
				},
			},
			select: {
				guilds: { select: { id: true, guild_ranks: { where: { level: 1 } } } },
			},
		});
		if (!findInvite) return NextResponse.json({ error: "Invitation not found" }, { status: 400 });

		const data = await prisma.guild_membership.create({
			data: {
				guild_id: findInvite?.guilds.id,
				player_id: +playerId,
				rank_id: findInvite.guilds.guild_ranks.filter((f) => f.level === 1)[0].id,
			},
			select: { guilds: { select: { name: true } } },
		});

		await prisma.guild_invites.delete({
			where: {
				player_id_guild_id: {
					guild_id: +guildId,
					player_id: +playerId,
				},
			},
		});

		const response: GuildsManagerIdJoinPlayerIdPATCHResponse = {
			guild_name: data.guilds.name,
		};

		revalidatePath("/account-manager");
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

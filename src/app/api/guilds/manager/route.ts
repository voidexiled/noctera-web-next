import type { GuildsManagerPOSTRequest, GuildsManagerPOSTResponse } from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { GlobalConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { GetAccountUnique } from "@/services/accounts/AccountsService";
import { CreateGuildMembership } from "@/services/guilds/GuildsMembershipService";
import { CreateGuild, GetFirstGuild } from "@/services/guilds/GuildsService";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
	try {
		const body: GuildsManagerPOSTRequest = await request.json();
		const { guild_name, player_id } = body;
		const session = await getServerSession(authOptions);
		// TODO: Implement a function like this:
		// validateSession(session, "user", { {error: "Unauthorized"}, {status: 401} });
		if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const acc = await GetAccountUnique({
			where: { id: Number(session.user.id) },
			include: { players: true },
		});

		if (!acc) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const findGuild = await GetFirstGuild({
			where: { name: guild_name },
		});
		if (findGuild) return NextResponse.json({ error: "Guild already exist" }, { status: 400 });

		const currentPlayer = acc.players.find((p) => p.id === player_id);

		if (!currentPlayer) return NextResponse.json({ error: "Player not found" }, { status: 400 });

		if (currentPlayer.level < 8) return NextResponse.json({ error: "Insufficient player level" }, { status: 400 });

		// Create the guild
		const guild = await CreateGuild({
			data: {
				name: guild_name,
				ownerid: player_id,
				logo_name: GlobalConfig.paths.default_guild_logo,
				creationdata: dayjs().unix(),
				description: "",
			},
			include: { guild_ranks: { where: { level: 3 }, select: { id: true } } },
		});

		// Assign the player as leader of the guild
		await CreateGuildMembership({
			data: {
				guild_id: guild.id,
				player_id,
				rank_id: guild.guild_ranks[0].id,
			},
		});

		const response: GuildsManagerPOSTResponse = undefined;
		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

import type { GuildManagerDELETEResponse, GuildsManagerDELETERequest } from "@/app/api/types";
import type { DeleteGuildResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { ManageUserSession } from "@/lib/helpers/api";
import { prisma } from "@/lib/prisma";
import { DeleteOneGuilds, GetUniqueGuilds } from "@/services/guilds/GuildsService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
	try {
		const body: GuildsManagerDELETERequest = await params;
		const guildId = +body.id;

		const foundGuild = await GetUniqueGuilds({
			where: { id: +guildId },
			select: {
				id: true,
				players: {
					select: {
						account_id: true,
					},
				},
			},
		});

		if (!foundGuild) return NextResponse.json({ error: "Guild not found" }, { status: 404 });

		if (!foundGuild.players.account_id) return NextResponse.json({ error: "Owner of guild not found" }, { status: 404 });

		await ManageUserSession((session) => {
			return +session.user.id !== foundGuild.players.account_id;
		});

		const deletedGuild = await DeleteOneGuilds({
			where: { id: guildId },
			select: {
				id: true,
				name: true,
			},
		});

		if (!deletedGuild) return NextResponse.json({ error: "Error deleting guild" }, { status: 404 });

		const response: GuildManagerDELETEResponse = {
			guild_id: deletedGuild.id,
			guild_name: deletedGuild.name,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

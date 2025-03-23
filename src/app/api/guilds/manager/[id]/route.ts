import type { GuildManagerDELETEResponse, GuildsManagerDELETERequest } from "@/app/api/types";
import type { DeleteGuildResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		const body: GuildsManagerDELETERequest = await params;
		const guildId = +body.id;

		const findGuild = await prisma.guilds.findUnique({
			where: { id: +guildId },
		});
		if (!findGuild) return NextResponse.json({ error: "Guild not found" }, { status: 404 });

		const findPlayer = await prisma.players.findUnique({
			where: { id: findGuild.ownerid },
		});
		if (!findPlayer) return NextResponse.json({ error: "Guild owner not found" }, { status: 404 });

		if (+session.user.id !== findPlayer.account_id)
			return NextResponse.json({ error: "You need to be the owner of the guild to delete it" }, { status: 403 });

		await prisma.guilds.delete({
			where: { id: guildId },
			select: {
				id: true,
				name: true,
			},
		});

		const response: GuildManagerDELETEResponse = {
			guild_id: guildId,
			guild_name: findGuild.name,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

import type { GuildsManagerIdKickPlayerIdDELETERequest, GuildsManagerIdKickPlayerIdDELETEResponse } from "@/app/api/types";
import type { KickGuildMemberResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { ManageUserSession } from "@/lib/helpers/api";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<GuildsManagerIdKickPlayerIdDELETERequest>;

export async function DELETE(request: NextRequest, params: Params) {
	try {
		const body = await params;
		const playerIdToKick = body.player_id;

		await ManageUserSession((session) => {
			return session.user.role === "admin" || +session.user.id === playerIdToKick;
		});

		const data = await prisma.guild_membership.delete({
			where: { player_id: +playerIdToKick },
			select: {
				guilds: { select: { name: true } },
				players: { select: { name: true, id: true } },
			},
		});

		if (!data) return NextResponse.json({ error: "Member of guild not found" }, { status: 404 });

		const response: GuildsManagerIdKickPlayerIdDELETEResponse = {
			player_id: data.players.id,
			player_name: data.players.name,
		};

		revalidatePath(`/guilds/${data.guilds.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

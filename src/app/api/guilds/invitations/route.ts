import type { GuildsInvitationsDELETERequest, GuildsInvitationsDELETEResponse } from "@/app/api/types";
import type { DeleteGuildInviteRequest, DeleteGuildInviteResponse } from "@/components/(community)/guilds/types/guilds";
import { prisma } from "@/lib/prisma";
import { DeleteGuildInvitation } from "@/services/guilds/GuildsInvitationsService";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
	try {
		const body: GuildsInvitationsDELETERequest = await request.json();

		const removedInvitation = await DeleteGuildInvitation({
			where: {
				player_id_guild_id: {
					guild_id: body.guild_id,
					player_id: body.player_id,
				},
			},
			select: {
				players: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!removedInvitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

		const dataResponse: GuildsInvitationsDELETEResponse = {
			guild_id: body.guild_id,
			player_id: removedInvitation.players.id,
			player_name: removedInvitation.players.name,
		};

		return NextResponse.json(dataResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

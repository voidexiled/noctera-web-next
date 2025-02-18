import type {
	DeleteGuildInviteRequest,
	DeleteGuildInviteResponse,
} from "@/components/(community)/guilds/types/guilds";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
	try {
		const data: DeleteGuildInviteRequest = await request.json();

		const removedInvitation = await prisma.guild_invites.delete({
			where: {
				player_id_guild_id: {
					guild_id: data.guild_id,
					player_id: data.player_id,
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

		if (!removedInvitation)
			return NextResponse.json({ message: "Invitation not found" }, { status: 404 });

		const dataResponse: DeleteGuildInviteResponse = {
			guild_id: data.guild_id,
			player_id: removedInvitation.players.id,
			player_name: removedInvitation.players.name,
		};

		return NextResponse.json(dataResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

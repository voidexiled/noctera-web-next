"use server";
import type { UserGuildStatus } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const getUserGuildAccount = async (guild_id: number, user_id: string | number) => {
	return await prisma.guilds.findUnique({
		where: { id: guild_id },
		select: {
			guild_membership: {
				where: {
					guild_id,
					AND: [{ players: { account_id: Number(user_id) } }],
				},
				select: {
					player_id: true,
					guilds: { select: { ownerid: true } },
					guild_ranks: { select: { level: true } },
				},
			},
		},
	});
};

export default async function getUserGuildStatus(
	guild_id: number,
): Promise<UserGuildStatus | null> {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return null;
	}

	const account = await getUserGuildAccount(guild_id, session.user.id);
	const guildMembership = account?.guild_membership[0];

	if (guildMembership) {
		const isOwner = guildMembership.player_id === guildMembership.guilds.ownerid;
		return {
			isLogged: true,
			manager: isOwner ? "owner" : "member",
			level: guildMembership.guild_ranks.level,
			player_id: guildMembership.player_id,
		};
	}

	return null;
}

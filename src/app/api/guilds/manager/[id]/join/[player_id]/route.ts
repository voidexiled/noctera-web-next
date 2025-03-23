import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
type Params = Promise<{ id: string; player_id: number }>;

const joinGuild = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const guildId = (await params).id;
		const playerId = (await params).player_id;

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
		if (!findInvite) return NextResponse.json({ message: "Invite not found" }, { status: 400 });

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

		revalidatePath("/account-manager");
		return NextResponse.json({ guild_name: data.guilds.name }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

export { joinGuild as PATCH };

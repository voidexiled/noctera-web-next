import type { KickGuildMemberResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ id: string; player_id: number }>;
const KickPlayer = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		const playerIdToKick = (await params).player_id;
		const hasAccess =
			session && (session.user.role === "admin" || playerIdToKick === +session.user.id);
		if (!hasAccess) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const data = await prisma.guild_membership.delete({
			where: { player_id: +playerIdToKick },
			select: {
				guilds: { select: { name: true } },
				players: { select: { name: true, id: true } },
			},
		});

		if (!data) return NextResponse.json({ message: "Member not found" }, { status: 400 });

		revalidatePath(`/guilds/${data.guilds.name}`);
		const dataToReturn: KickGuildMemberResponse = {
			player_id: data.players.id,
			player_name: data.players.name,
		};

		return NextResponse.json(dataToReturn, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

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
			select: { guilds: { select: { name: true } } },
		});

		revalidatePath(`/guilds/${data.guilds.name}`);
		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

export { KickPlayer as DELETE, ChangeRank as PUT };

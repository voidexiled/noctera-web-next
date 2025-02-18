import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string; rank_id: number }>;

const DeleteRank = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const guildId = (await params).id;
		const rankId = (await params).rank_id;

		const findGuild = await prisma.guilds.findUnique({
			where: { id: +guildId },
		});
		if (!findGuild) return NextResponse.json({ message: "Guild not found." }, { status: 400 });

		const findPlayerInRank = await prisma.guild_ranks.findFirst({
			where: { id: +rankId },
			include: { guild_membership: true },
		});
		if (findPlayerInRank && findPlayerInRank.guild_membership.length > 0)
			return NextResponse.json({ message: "Found player in ranking." }, { status: 400 });

		await prisma.guild_ranks.delete({
			where: {
				id: +rankId,
			},
		});

		revalidatePath(`/guilds/${findGuild.name}`);
		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

export { DeleteRank as DELETE };

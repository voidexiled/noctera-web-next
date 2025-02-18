import type { PlayerResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import type { players } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = Promise<{ account_id: string }>;

const ListPlayer = async (request: Request, segmentData: { params: Params }) => {
	try {
		const params = await segmentData.params;
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const account: PlayerResponse = await prisma.accounts.findUnique({
			where: { id: +params.account_id },
			include: {
				players: {
					where: {
						level: { gte: 8 },
						guild_membership: null,
					},
				},
			},
		});

		const convertedPlayer = account?.players
			? convertBigIntsToNumbers<players[]>(account?.players)
			: [];

		return NextResponse.json({
			player: convertedPlayer,
		});
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

export { ListPlayer as GET };

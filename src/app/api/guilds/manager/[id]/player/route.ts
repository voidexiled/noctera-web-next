import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

const find = async (request: Request, { params }: { params: Params }) => {
	const playerName = (await params).name;
	const characters = await prisma.players.findMany({
		where: {
			AND: [
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
				{
					name: {
						contains: playerName ? decodeURIComponent(playerName) : undefined,
					},
				},
			],
		},
	});

	return NextResponse.json(convertBigIntsToNumbers(characters));
};

export { find as GET };

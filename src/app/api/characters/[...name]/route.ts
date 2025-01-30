import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

const find = async (request: Request, segmentData: { params: Params }) => {
	const params = await segmentData.params;
	const characters = await prisma.players.findMany({
		where: {
			AND: [
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
				{
					name: {
						contains: params.name ? decodeURIComponent(params.name) : undefined,
					},
				},
			],
		},
		take: 25,
	});

	return NextResponse.json(convertBigIntsToNumbers(characters));
};

export { find as GET };

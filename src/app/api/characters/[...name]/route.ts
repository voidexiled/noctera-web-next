import type { CharactersByNameGETResponse } from "@/app/api/types";
import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<{ name: string }>;

export async function GET(request: NextRequest, segmentData: { params: Params }) {
	try {
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
			select: {
				id: true,
				name: true,
				vocation: true,
				level: true,
				looktype: true,
				hidden: true,
			},
			take: 25,
		});

		const response: CharactersByNameGETResponse = {
			characters: convertBigIntsToNumbers(characters),
		};

		return NextResponse.json(response);
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

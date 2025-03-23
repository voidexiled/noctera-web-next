import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { NextResponse } from "next/server";

type Params = Promise<{
	name: string;
}>;
// TODO: Unused, need to remove it?
export async function GET(request: Request, { params }: { params: Params }) {
	const characters = await prisma.guilds.findMany({
		include: {
			players: {
				select: {
					name: true,
				},
			},
			guild_membership: {
				select: {
					players: {
						select: {
							_count: true,
						},
					},
				},
			},
		},
	});

	return NextResponse.json(convertBigIntsToNumbers(characters));
}

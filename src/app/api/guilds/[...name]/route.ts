import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { NextResponse } from "next/server";

type Params = Promise<{
	name: string;
}>;

export async function GET(request: Request, props: { params: Promise<Params> }) {
	const params = await props.params;
	const characters = await prisma.guilds.findMany({
		where: {
			AND: [{ name: { contains: decodeURIComponent(params.name) } }],
		},
		include: {
			players: {
				select: {
					name: true,
				},
			},
		},
		take: 25,
	});
	return NextResponse.json(convertBigIntsToNumbers(characters));
}

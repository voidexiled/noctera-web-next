import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

type Params = Promise<{ id: number }>;

const PlayerSchema = z
	.object({
		comment: z.string().optional(),
		hidden: z.boolean().optional(),
	})
	.strict();

const update = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const playerId = (await params).id;
		if (!playerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const { comment, hidden } = PlayerSchema.parse(await request.json());

		await prisma.players.update({
			where: { id: playerId },
			data: { comment, hidden },
		});

		return NextResponse.json({}, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
	}
};

export { update as PUT };

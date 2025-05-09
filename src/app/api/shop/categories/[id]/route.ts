import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

const List = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const playerId = (await params).id;
		const findCategories = await prisma.players.findUnique({
			where: { id: +playerId },
		});

		return NextResponse.json(findCategories);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
};

export { List as GET };

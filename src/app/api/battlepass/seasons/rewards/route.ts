import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;

		if (!user || user.role !== "admin")
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const rewards = await prisma.battlepass_seasons_rewards.findMany();

		if (!rewards)
			return NextResponse.json({
				message: "Error fetching rewards.",
				status: 404,
			});

		return NextResponse.json({ rewards: rewards, status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}

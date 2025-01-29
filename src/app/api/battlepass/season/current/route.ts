import { isDateActive } from "@/app/(battlepass)/battlepass/lib/utils";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const seasons = await prisma.battlepass_seasons.findMany({
			include: {
				battlepass_seasons_rewards: true,
				battlepass_seasons_tasks: true,
			},
		});

		if (!seasons) {
			return NextResponse.json({ message: "No seasons found.", status: 404 });
		}

		const currentSeason = seasons.filter((_season) => {
			// _season date_start and date_end are in dd/mm/yyyy format
			return isDateActive(
				dayjs().unix(),
				_season.date_start.toISOString(),
				_season.date_end.toISOString(),
			);
		});

		if (!currentSeason) {
			return NextResponse.json({
				message: "No current season found.",
				status: 404,
			});
		}

		return NextResponse.json({ season: currentSeason[0], status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}

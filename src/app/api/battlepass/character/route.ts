import { status } from "@/app/layout";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const { id, season_id } = (await request.json()) as {
			id: number;
			season_id: number;
		};

		const character = await prisma.players
			.findUnique({
				where: { id: Number(id) },
				select: {
					name: true,
					level: true,
					id: true,
					battlepass_rank: true,
					vocation: true,
					player_battlepass_progress: {
						where: {
							season_id: Number(season_id),
						},
					},
					player_battlepass_tasks: {
						where: {
							season_id: Number(season_id),
						},
					},
					player_battlepass_rewards_claimed: {
						where: {
							season_id: Number(season_id),
						},
					},
				},
			})
			.catch((err) => {
				console.log(err);
				throw new Error("Error fetching character");
			});
		console.log("character: ", character);

		if (!character) {
			return NextResponse.json({
				status: 404,
				statusText: "Character not found",
			});
		}

		return NextResponse.json({ player: character, status: 200 });
	} catch (error) {
		console.error("Error during character fetch: ", error);
		return new Response((error as Error).message, { status: 500 });
	}
}

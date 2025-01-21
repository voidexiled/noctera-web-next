import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

type Params = {
	player_id: string;
	season_id: string;
	reward_id: string;
};

export async function POST(req: NextRequest) {
	try {

		const session = await getServerSession(authOptions);
		const user = session?.user;
    	if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		
		const { player_id, season_id, reward_id } = (await req.json()) as Params;

		if (!player_id || !season_id || !reward_id) {
			return NextResponse.json({ status: 400 });
		}

		const alreadyClaimed =
			await prisma.player_battlepass_rewards_claimed.findFirst({
				where: {
					player_id: Number(player_id),
					season_id: Number(season_id),
					reward_id: Number(reward_id),
				},
			});
		console.log("already claimed?", alreadyClaimed);

		if (alreadyClaimed) {
			return NextResponse.json({
				status: 400,
				statusText: "Player battlepass reward already claimed",
			});
		}

		const res = await prisma.player_battlepass_rewards_claimed
			.create({
				data: {
					player_id: Number(player_id),
					season_id: Number(season_id),
					reward_id: Number(reward_id),
					claimed_at: new Date(),
				},
			})
			.catch((error) => {
				console.log(error);
				return NextResponse.json((error as Error).message, { status: 500 });
			});

		if (!res) {
			return NextResponse.json({
				status: 404,
				statusText: "Error on claim player battlepass reward",
			});
		}

		return NextResponse.json(res);
	} catch (error) {
		console.log(error);
		return new Response((error as Error).message, { status: 500 });
	}
}

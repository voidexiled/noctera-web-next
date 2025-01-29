import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
	BATTLEPASS_RANK_ACCESS,
	BATTLEPASS_TYPE_REWARDS,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user || user.role !== "admin")
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const data: {
			id: string;
			season_id: string;
			level: string;
			reward_name: string;
			reward_img: string;
			reward_type: string;
			reward_amount: string;
			reward_value: string;
			reward_should_plus_amount: boolean;
			reward_required_access: string;
			description: string;
			visible: boolean;
		} = await request.json();

		const reward = await prisma.battlepass_seasons_rewards.update({
			where: {
				id: Number.parseInt(data.id),
			},
			data: {
				season_id: Number.parseInt(data.season_id),
				level: Number.parseInt(data.level),
				reward_name: data.reward_name,
				reward_img: data.reward_img,
				reward_type: (
					data.reward_type as string
				).toUpperCase() as BATTLEPASS_TYPE_REWARDS,
				reward_amount: Number.parseInt(data.reward_amount),
				reward_value: Number.parseInt(data.reward_value),
				reward_should_plus_amount: data.reward_should_plus_amount,
				reward_required_access: (
					data.reward_required_access as string
				).toUpperCase() as BATTLEPASS_RANK_ACCESS,
				description: data.description,
				visible: data.visible,
			},
		});

		if (!reward)
			return NextResponse.json({
				message: "Error updating reward.",
				status: 404,
			});

		return NextResponse.json({ reward: reward, status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}

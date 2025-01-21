import { status } from '@/app/layout'
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
    	if (!user || user.role !== "admin") return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		
		const { id, season_id } = (await request.json()) as {
			id: string;
			season_id: string;
		};
		

		const account = await prisma.accounts.findUnique({
			where: { id: Number(id) },
			include: {
				players: {
					include: {
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
				},
			},
		});

		


        if (!account) {
            return NextResponse.json({
                status: 404,
                statusText: "Account not found",
            });
		}

        return NextResponse.json({account, status: 200});
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
}

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
		const user = session?.user;
    	if (!user || user.role !== "admin") return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const data: {rewards: boolean, tasks: boolean} = await request.json();
        const seasons = await prisma.battlepass_seasons.findMany({
            include: {
                battlepass_seasons_rewards: data.rewards ? true : undefined,
                battlepass_seasons_tasks: data.tasks ? true : undefined,
            }
        });
        
        if (!seasons) 
            return NextResponse.json({message: "Error fetching seasons.", status: 404 });

        return NextResponse.json({ seasons: seasons, status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500});
    }
}
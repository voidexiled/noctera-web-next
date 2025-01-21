import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
		const user = session?.user;
    	if (!user || user.role !== "admin") return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const tasks = await prisma.battlepass_seasons_tasks.findMany();
        
        if (!tasks) 
            return NextResponse.json({message: "Error fetching tasks.", status: 404 });

        return NextResponse.json({ tasks: tasks, status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500});
    }
}
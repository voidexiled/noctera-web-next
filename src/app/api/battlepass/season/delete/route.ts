import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const session = await getServerSession(authOptions);
		const user = session?.user;
    	if (!user || user.role !== "admin") return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const data: {id: number} = await request.json();

        const deleted = await prisma.battlepass_seasons.delete({
            where: {
                id: data.id
            }
        })

        if (!deleted) 
            return NextResponse.json({message: "Error deleting season.", status: 404 });

        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500 });
    }
}
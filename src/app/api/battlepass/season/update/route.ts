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

		const data: {
			id: string;
			season_number: string;
			season_name: string;
			date_start: Date;
			date_end: Date;
			background_img: string;
			description: string;
		} = await request.json();
		const updated = await prisma.battlepass_seasons
			.update({
				where: {
					id: Number.parseInt(data.id),
				},
				data: {
					season_number: data.season_number,
					season_name: data.season_name,
					date_start: data.date_start,
					date_end: data.date_end,
					background_img: data.background_img,
					description: data.description,
				},
			})
			.catch((error) => {
				error;
			});

		if (!updated)
			return NextResponse.json({
				message: "Error updating season.",
				status: 404,
			});

		return NextResponse.json({ status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}

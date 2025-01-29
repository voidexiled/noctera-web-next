import { isDateActive } from "@/app/(battlepass)/battlepass/lib/utils";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateSeasonSchema = z.object({
	seasonNumber: z.string(),
	seasonName: z.string(),
	seasonDateStart: z.date(),
	seasonDateEnd: z.date(),
	backgroundImageName: z.string(),
	seasonDescription: z.string(),
});

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user || user.role !== "admin")
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const data: {
			season_number: string;
			season_name: string;
			date_start: Date;
			date_end: Date;
			background_img: string;
			description: string;
		} = await request.json();

		const createdSeason = await prisma.battlepass_seasons.create({
			data: {
				season_number: data.season_number,
				season_name: data.season_name,
				date_start: data.date_start,
				date_end: data.date_end,
				background_img: data.background_img,
				description: data.description,
			},
		});

		if (!createdSeason)
			return NextResponse.json({
				message: "Error creating new season.",
				status: 404,
			});

		return NextResponse.json({ season: createdSeason, status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}

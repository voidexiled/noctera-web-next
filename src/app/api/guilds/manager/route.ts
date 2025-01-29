import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const ListGuild = async (request: Request) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const guilds = await prisma.guilds.findMany();

		return NextResponse.json({ guilds });
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
};

const CreateSchema = z.object({
	guild_name: z.string(),
	player_id: z.number(),
});

const CreateGuild = async (request: Request) => {
	try {
		const { guild_name, player_id } = CreateSchema.parse(await request.json());
		console.log("step1");
		const session = await getServerSession(authOptions);
		if (!session || !session.user)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		console.log("step2");
		const acc = await prisma.accounts.findUnique({
			where: { id: Number(session.user.id) },
			include: { players: true },
		});
		console.log("step3");

		if (!acc)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		// if (!acc.premdays)
		// 	return NextResponse.json(
		// 		{ message: "Account no has premium" },
		// 		{ status: 401 },
		// 	);

		console.log("step4");

		const findGuild = await prisma.guilds.findFirst({
			where: { name: guild_name },
		});
		console.log("step5");
		if (findGuild)
			return NextResponse.json(
				{ message: "Guild already exist." },
				{ status: 400 },
			);
		console.log("step6");

		const currentPlayer = acc.players.find((p) => p.id === player_id);
		console.log("step7");
		if (!currentPlayer)
			return NextResponse.json(
				{ message: "Player not found." },
				{ status: 400 },
			);
		console.log("step8");
		if (currentPlayer.level < 8)
			return NextResponse.json(
				{ message: "Insufficient player level." },
				{ status: 400 },
			);
		console.log("step9");

		const defaultRanks = [
			{ name: "Leader", level: 3 },
			{ name: "Vice Leader", level: 2 },
			{ name: "Member", level: 1 },
		];

		const guild = await prisma.guilds.create({
			data: {
				name: guild_name,
				ownerid: player_id,
				logo_name: "default.gif",
				creationdata: dayjs().unix(),
				description: "",
				guild_ranks: {
					create: defaultRanks,
				},
			},
			include: { guild_ranks: { where: { level: 3 }, select: { id: true } } },
		});
		console.log("step10");

		await prisma.guild_membership.create({
			data: {
				guild_id: guild.id,
				player_id,
				rank_id: guild.guild_ranks[0].id,
			},
		});
		console.log("step11");

		return NextResponse.json({}, { status: 201 });
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
};

export { ListGuild as GET, CreateGuild as POST };

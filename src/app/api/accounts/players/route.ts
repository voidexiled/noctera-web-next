import dayjs from "dayjs";
import { ZodError, z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const CreatePlayersSchema = z
	.object({
		name: z.string(),
		sex: z.number().min(0).max(1),
		//tutorial: z.boolean(),
		world_id: z.number().optional(),
		vocation: z.string().default("0"),
	})
	.strict();

export async function POST(req: Request) {
	try {
		const data: {
			name: string;
			sex: number;
			vocation: string;
		} = await req.json();

		const { name, sex, vocation } = data;
		const session = await getServerSession(authOptions);
		const acc = await prisma.accounts.findUnique({
			where: { id: Number(session?.user?.id) },
		});
		if (!session?.user || !acc)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const findPlayers = await prisma.accounts.findFirst({ where: { name } });

		if (findPlayers) {
			return NextResponse.json({ message: "Player name already exists" }, { status: 400 });
		}
		const initialPlayerName =
			vocation === "1"
				? "Sorcerer Sample"
				: vocation === "2"
					? "Druid Sample"
					: vocation === "3"
						? "Paladin Sample"
						: vocation === "4"
							? "Knight Sample"
							: "Rook Sample";

		const findInitialPlayer = await prisma.players.findFirst({
			where: { name: initialPlayerName },
		});

		if (!findInitialPlayer) {
			return NextResponse.json({ error: "Initial Player not exist." }, { status: 500 });
		}

		const { id, account_id, ...restInitialPlayer } = findInitialPlayer || {
			id: undefined,
			account_id: undefined,
		};
		const playerData = {
			...restInitialPlayer,
			account_id: Number(session?.user?.id),
			name,
			sex,
			//world_id: world_id ?? 1,
			// created: dayjs().unix(),
			conditions: Uint8Array.from({ length: 1024 }),
			comment: "",
		};
		const playerCreated = await prisma.players.create({
			data: playerData,
		});

		if (!playerCreated) {
			return NextResponse.json({ error: "Error creating character." }, { status: 500 });
		}

		const battlepassSeasons = await prisma.battlepass_seasons.findMany({
			select: { id: true, season_number: true },
		});

		const latestSeason = battlepassSeasons.sort(
			(a, b) => Number(b.season_number) - Number(a.season_number),
		)[0];

		if (!latestSeason) return NextResponse.json({}, { status: 200 });

		await prisma.player_battlepass_progress
			.create({
				data: {
					current_exp: 0,
					season_id: latestSeason.id,
					player_id: playerCreated.id,
				},
			})
			.catch((err) => {
				console.log(err);
			});

		const latestSeasonTasks = await prisma.battlepass_seasons_tasks.findMany({
			where: { season_id: latestSeason.id },
		});

		const playerTasks = latestSeasonTasks.map((task) => {
			return {
				player_id: playerCreated.id,
				task_id: task.id,
				season_id: latestSeason.id,
			};
		});

		const createdPlayerTasks = await prisma.player_battlepass_tasks.createMany({
			data: playerTasks,
		});

		return NextResponse.json({}, { status: 200 });
	} catch (err) {
		if (err instanceof ZodError) {
			return NextResponse.json(
				{ message: "Validation error.", issues: err.issues[0] },
				{ status: 400 },
			);
		}
		return NextResponse.json({ err }, { status: 500 });
	}
}

import configLua from "@/hooks/useConfigLua";
import { prisma } from "@/lib/prisma";
import { encryptPassword } from "@/utils/functions/criptoPassword";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import type { AuthRegisterPOSTRequest } from "@/app/api/types";
import { GlobalConfig } from "@/lib/config";
import { BATTLEPASS_RANK_ACCESS } from "@prisma/client";
import { ZodError, z } from "zod";

//  World Pvp Types
// 0 >> Open PvP
// 1 >> Optional PvP
// 2 >> Hardcore PvP
// 3 >> Retro Open PvP
// 4 >> Retro Hardcore

const passwordUppercase = z
	.string()
	.regex(/[A-Z]/, "The password should contain at least 1 uppercase character");
const passwordLowercase = z
	.string()
	.regex(/[a-z]/, "The password must contain at least one lowercase letter");
const passwordDigit = z
	.string()
	.regex(/\d/, "The password must contain at least one numeric digit");
const passwordSpecialChar = z
	.string()
	.regex(
		/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
		"The password must contain at least one special character",
	);

const CreateAccountSchema = z
	.object({
		name: z.string(),
		email: z
			.string()
			.email("Debe ser un correo electrónico válido")
			.transform((value) => value.toLowerCase().replace(/\s/g, "")),
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.and(passwordUppercase)
			.and(passwordLowercase)
			.and(passwordDigit)
			.and(passwordSpecialChar),
		characterName: z.string(),
		gender: z.enum(["female", "male"]),
		wordLocation: z.number().int().min(0).max(3).default(1),
		wordType: z.number().int().min(0).max(5).default(1),
		country: z.string(),
		vocation: z.string().default("0"),
		phone: z.string(),
		rlname: z.string(),
	})
	.strict();

const lua = configLua();

export type RouteErrorResponse = {
	error: string;
	status: number;
};

export async function POST(req: Request) {
	try {
		const data = await CreateAccountSchema.parseAsync(await req.json());
		const dataRequest: AuthRegisterPOSTRequest = data as AuthRegisterPOSTRequest;

		const existsUser = await prisma.accounts.findFirst({
			where: { OR: [{ name: dataRequest.name }, { email: dataRequest.email }] },
		});
		if (existsUser) {
			return NextResponse.json({ error: "Account already registered" }, { status: 400 });
		}
		const existsPlayer = await prisma.players.findFirst({
			where: { name: dataRequest.characterName },
		});
		if (existsPlayer) {
			return NextResponse.json(
				{ error: `Character name ${dataRequest.characterName} is already in use` },
				{ status: 400 },
			);
		}

		const initialPlayerName =
			dataRequest.vocation === "1"
				? "Sorcerer Sample"
				: dataRequest.vocation === "2"
					? "Druid Sample"
					: dataRequest.vocation === "3"
						? "Paladin Sample"
						: dataRequest.vocation === "4"
							? "Knight Sample"
							: "Rook Sample";

		const findInitialPlayer = await prisma.players.findFirst({
			where: { name: initialPlayerName },
		});

		if (!findInitialPlayer)
			return NextResponse.json({ error: "Initial Player not exist." }, { status: 500 });

		const { id, account_id, ...restInitialPlayer } = findInitialPlayer || {
			id: undefined,
			account_id: undefined,
		};

		const [createdAccount, latestSeason] = await prisma.$transaction(async (transaction) => {
			const newAccount = await transaction.accounts.create({
				data: {
					name: dataRequest.name,
					email: dataRequest.email,
					password: encryptPassword(dataRequest.password),
					creation: dayjs().unix(),
					country: dataRequest.country,
					phone: dataRequest.phone,
					rlname: dataRequest.rlname,
					coins_transferable: GlobalConfig.new_account.add_transferable_coins
						? GlobalConfig.new_account.coins_transferable
						: 0,
					coins: GlobalConfig.new_account.add_coins ? GlobalConfig.new_account.coins : 0,
					premdays: GlobalConfig.new_account.add_vip_days ? GlobalConfig.new_account.vip_days : 0,
					players: {
						create: {
							...restInitialPlayer,
							name: dataRequest.characterName,
							sex: dataRequest.gender === "female" ? 0 : 1,
							level: findInitialPlayer.level,
							vocation: findInitialPlayer.vocation,
							health: findInitialPlayer.health,
							healthmax: findInitialPlayer.healthmax,
							experience: findInitialPlayer.experience,
							battlepass_rank: BATTLEPASS_RANK_ACCESS.FREE,
						},
					},
				},
			});

			const fetchedAccount = await transaction.accounts.findFirst({
				where: {
					id: newAccount.id,
				},
				include: {
					players: true,
				},
			});

			const currentPlayer = fetchedAccount?.players[0];

			if (!fetchedAccount || !currentPlayer) throw new Error("Account creation failed");

			const battlepassSeasons = await transaction.battlepass_seasons.findMany({
				select: { id: true, season_number: true },
			});

			const latestSeason = battlepassSeasons.sort(
				(a, b) => Number(b.season_number) - Number(a.season_number),
			)[0];

			if (latestSeason) {
				await transaction.player_battlepass_progress.create({
					data: {
						current_exp: 0,
						season_id: latestSeason.id,
						player_id: currentPlayer.id,
					},
				});

				const latestSeasonTasks = await transaction.battlepass_seasons_tasks.findMany({
					where: { season_id: latestSeason.id },
				});

				const playerTasks = latestSeasonTasks.map((task) => {
					return {
						player_id: currentPlayer.id,
						task_id: task.id,
						season_id: latestSeason.id,
					};
				});

				await transaction.player_battlepass_tasks.createMany({
					data: playerTasks,
				});
			}

			return [newAccount, latestSeason];
		});

		return NextResponse.json({ message: "Account created successfully" }, { status: 200 });
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
		}
		return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
	}
}

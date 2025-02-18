import configLua from "@/hooks/useConfigLua";
import { prisma } from "@/lib/prisma";
import { encryptPassword } from "@/utils/functions/criptoPassword";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import { pageConfig } from "@/lib/config";
//import { positions, samplePlayer } from "../../../../../prisma/seed";
import { MailProvider } from "@/lib/nodemailer";
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
		const emailProvider = new MailProvider();
		const data = await CreateAccountSchema.parseAsync(await req.json());
		console.log("dataRouteParsed", data);
		const existsUser = await prisma.accounts.findFirst({
			where: { OR: [{ name: data.name }, { email: data.email }] },
		});
		if (existsUser) {
			return NextResponse.json({ error: "Account already registered" }, { status: 400 });
		}
		const existsPlayer = await prisma.players.findFirst({
			where: { name: data.characterName },
		});
		if (existsPlayer) {
			return NextResponse.json(
				{ error: `Character name ${data.characterName} is already in use` },
				{ status: 400 },
			);
		}

		const initialPlayerName =
			data.vocation === "1"
				? "Sorcerer Sample"
				: data.vocation === "2"
					? "Druid Sample"
					: data.vocation === "3"
						? "Paladin Sample"
						: data.vocation === "4"
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

		const createdAccount = await prisma.accounts.create({
			data: {
				name: data.name,
				email: data.email,
				password: encryptPassword(data.password),
				creation: dayjs().unix(),
				country: data.country,
				phone: data.phone,
				rlname: data.rlname,
				coins_transferable: pageConfig.new_account.add_transferable_coins
					? pageConfig.new_account.coins_transferable
					: 0,
				coins: pageConfig.new_account.add_coins ? pageConfig.new_account.coins : 0,
				premdays: pageConfig.new_account.add_vip_days ? pageConfig.new_account.vip_days : 0,
				players: {
					create: {
						...restInitialPlayer,
						name: data.characterName,
						sex: data.gender === "female" ? 0 : 1,
						level: findInitialPlayer.level,
						vocation: findInitialPlayer.vocation,
						health: findInitialPlayer.health,
						healthmax: findInitialPlayer.healthmax,
						experience: findInitialPlayer.experience,
						battlepass_rank: BATTLEPASS_RANK_ACCESS.FREE,
						//creation: dayjs().unix(),
					},
				},
			},
		});

		// await emailProvider.SendMail({
		// 	to: data.email,
		// 	subject: "Welcome to Noctera Global",
		// 	text: "Bienvenido",
		// 	html: `
		//   <div>
		//      <h1>Follow the following link</h1>
		//       <p>Please follow
		//         <a href=""> this link </a>
		//         to reset your password
		//         </p>
		//   </div>
		//   `,
		// });

		const createdAccountSearched = await prisma.accounts.findFirst({
			where: {
				id: createdAccount.id,
			},
			include: {
				players: true,
			},
		});

		const playerCreated = createdAccountSearched?.players[0];

		if (!createdAccountSearched || !playerCreated) throw Error();

		const battlepassSeasons = await prisma.battlepass_seasons.findMany({
			select: { id: true, season_number: true },
		});

		const latestSeason = battlepassSeasons.sort(
			(a, b) => Number(b.season_number) - Number(a.season_number),
		)[0];

		if (latestSeason) {
			await prisma.player_battlepass_progress.create({
				data: {
					current_exp: 0,
					season_id: latestSeason.id,
					player_id: playerCreated.id,
				},
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
		}

		NextResponse.json({}, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ZodError) {
			return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
		}
		return NextResponse.json({ error: error }, { status: 500 });
	}
	return NextResponse.json(null, { status: 200 });
}

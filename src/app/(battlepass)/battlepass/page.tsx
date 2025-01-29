import { CharacterBattlepass } from "@/app/(battlepass)/battlepass/components/character-battlepass";
import { BattlepassProvider } from "@/app/(battlepass)/battlepass/components/context/BattlepassContext";
import { LastSeasonCard } from "@/app/(battlepass)/battlepass/components/info/LastSeasonCard";
import { NextSeasonCard } from "@/app/(battlepass)/battlepass/components/info/NextSeasonCard";
import { isDateActive } from "@/app/(battlepass)/battlepass/lib/utils";
import { ErrorCardMessage } from "@/components/common/ErrorCardMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { ERROR, ERROR_TYPE } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type {
	battlepass_seasons,
	battlepass_seasons_rewards,
	battlepass_seasons_tasks,
} from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { getPossibleInstrumentationHookFilenames } from "next/dist/build/utils";
import { redirect } from "next/navigation";

async function getAcc(
	id: string,
	cs: battlepass_seasons & {
		battlepass_seasons_tasks: battlepass_seasons_tasks[];
		battlepass_seasons_rewards: battlepass_seasons_rewards[];
	},
) {
	const account = await prisma.accounts.findUnique({
		where: { id: Number(id) },
		include: {
			players: {
				include: {
					player_battlepass_progress: {
						where: {
							season_id: Number(cs.id),
						},
					},
					player_battlepass_tasks: {
						where: {
							season_id: Number(cs.id),
						},
					},
					player_battlepass_rewards_claimed: {
						where: {
							season_id: Number(cs.id),
						},
					},
				},
			},
		},
	});
	return account;
}

async function getAccount(
	id: string,
	cs: battlepass_seasons & {
		battlepass_seasons_tasks: battlepass_seasons_tasks[];
		battlepass_seasons_rewards: battlepass_seasons_rewards[];
	},
) {
	let hasUpdatedSomething = false;
	let account = await getAcc(id, cs);
	if (!account) return;
	// Check if the player has initialized the progress for the current season
	if (account.players.some((p) => !p.player_battlepass_progress.length)) {
		const playersWithoutProgress = account.players.filter(
			(p) => !p.player_battlepass_progress.length,
		);

		for (const player of playersWithoutProgress) {
			console.log("no progress", player.name, player.id);
			const res = await initPlayerProgressForSeason(player.id, cs.id);
			console.log(player.name);
			console.log("res", res);
		}
		hasUpdatedSomething = true;
	}

	// Check if the player has added all the tasks for the current season
	if (
		account.players.some(
			(p) =>
				p.player_battlepass_tasks.length < cs.battlepass_seasons_tasks.length,
		)
	) {
		const playersWithoutAllTasks = account.players.filter(
			(p) =>
				p.player_battlepass_tasks.length < cs.battlepass_seasons_tasks.length,
		);

		for (const player of playersWithoutAllTasks) {
			console.log("no all tasks", player.name, player.id);
			const res = await addRemainingTasksForSeason(player.id, cs.id);
			console.log(player.name);
			console.log("res", res);
		}
		hasUpdatedSomething = true;
	}
	if (hasUpdatedSomething) {
		account = await getAcc(id, cs);
	}
	return account;
}

async function getCurrentSeason() {
	const seasons = await prisma.battlepass_seasons.findMany({
		include: {
			battlepass_seasons_rewards: true,
			battlepass_seasons_tasks: true,
		},
	});

	const currentSeason = seasons.filter((_season) => {
		// _season date_start and date_end are in dd/mm/yyyy format
		return isDateActive(
			dayjs().unix(),
			_season.date_start.toISOString(),
			_season.date_end.toISOString(),
		);
	});
	return currentSeason[0];
}

async function getSeasons() {
	const seasons = await prisma.battlepass_seasons.findMany();
	return seasons;
}

async function initPlayerProgressForSeason(playerId: number, seasonId: number) {
	const player = await prisma.players.findUnique({
		where: { id: playerId },
	});

	if (!player) return;

	const playerBattlepassProgress =
		await prisma.player_battlepass_progress.findMany({
			where: { player_id: playerId, season_id: seasonId },
		});

	if (playerBattlepassProgress.length > 0) return;

	const progress = await prisma.player_battlepass_progress.create({
		data: {
			player_id: playerId,
			season_id: seasonId,
			current_exp: 0,
		},
	});
	return progress;
}

async function addRemainingTasksForSeason(playerId: number, seasonId: number) {
	const player = await prisma.players.findUnique({
		where: { id: playerId },
	});

	if (!player) return;

	const seasonTasks = await prisma.battlepass_seasons_tasks.findMany({
		where: { season_id: seasonId },
	});

	const playerTasks = await prisma.player_battlepass_tasks.findMany({
		where: { player_id: playerId, season_id: seasonId },
	});

	for (const task of seasonTasks) {
		if (!playerTasks.some((p) => p.task_id === task.id)) {
			const taskCreated = await prisma.player_battlepass_tasks.create({
				data: {
					player_id: playerId,
					season_id: seasonId,
					task_id: task.id,
					current_amount: 0,
					claimed: false,
					finished: false,
				},
			});
			console.log("task progress added for player", player.name, taskCreated);
		}
	}

	const newPlayersTasks = await prisma.player_battlepass_tasks.findMany({
		where: { player_id: playerId, season_id: seasonId },
	});

	return newPlayersTasks;
}

export default async function BattlepassPage() {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) redirect("/");

	const cs = await getCurrentSeason();

	if (!cs) {
		const seasons = await getSeasons();
		if (!seasons || seasons.length === 0) {
			return (
				<ErrorCardMessage
					errorType={ERROR_TYPE.BATTLEPASS}
					errorMessage={ERROR.BATTLEPASS_CURRENT_SEASON_INFO_NOT_FOUND}
				/>
			);
		}

		const currentTimestamp = dayjs().unix();

		const previousSeasons = seasons.filter((season) => {
			const seasonTimestamp = dayjs(season.date_start).unix();
			return seasonTimestamp < currentTimestamp;
		});

		const lastSeason = previousSeasons.reduce((acc, season) => {
			const currentTimestamp = dayjs(season.date_end).unix();

			return currentTimestamp > dayjs(acc.date_end).unix() ? season : acc;
		}, previousSeasons[0]);

		console.log(lastSeason);

		const nextSeasons = seasons.filter((season) => {
			const seasonTimestamp = dayjs(season.date_start).unix();
			return seasonTimestamp > currentTimestamp;
		});

		const nextSeason = nextSeasons.reduce((acc, season) => {
			const currentTimestamp = dayjs(season.date_start).unix();

			return currentTimestamp > dayjs(acc.date_end).unix() ? season : acc;
		}, nextSeasons[0]);

		console.log(nextSeason);

		return (
			<>
				{lastSeason && <LastSeasonCard lastSeason={lastSeason} />}

				{nextSeason && <NextSeasonCard nextSeason={nextSeason} />}
			</>
		);
	}

	const acc = await getAccount(user.id, cs);

	if (!acc)
		return (
			<ErrorCardMessage
				errorType={ERROR_TYPE.BATTLEPASS}
				errorMessage={ERROR.BATTLEPASS_ACCOUNT_INFO_NOT_FOUND}
			/>
		);

	return (
		<BattlepassProvider acc={acc} cs={cs}>
			<Card>
				<CardHeader className="border-b bg-background">
					<CardTitle>Battlepass</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 p-2">
					<CharacterBattlepass />
				</CardContent>
			</Card>
		</BattlepassProvider>
	);
}

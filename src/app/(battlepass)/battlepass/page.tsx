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
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { getPossibleInstrumentationHookFilenames } from "next/dist/build/utils";
import { redirect } from "next/navigation";

async function getAccount(id: string, season_id: number) {
	const account = await prisma.accounts.findUnique({
		where: { id: Number(id) },
		include: {
			players: {
				include: {
					player_battlepass_progress: {
						where: {
							season_id: Number(season_id),
						},
					},
					player_battlepass_tasks: {
						where: {
							season_id: Number(season_id),
						},
					},
					player_battlepass_rewards_claimed: {
						where: {
							season_id: Number(season_id),
						},
					},
				},
			},
		},
	});
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
		})

		const lastSeason = previousSeasons.reduce((acc, season) => {
			const currentTimestamp = dayjs(season.date_end).unix();
			
			return currentTimestamp > dayjs(acc.date_end).unix() ? season : acc;
		  }, previousSeasons[0]);


		console.log(lastSeason);

		const nextSeasons = seasons.filter((season) => {
			const seasonTimestamp = dayjs(season.date_start).unix();
			return seasonTimestamp > currentTimestamp;
		})

		const nextSeason = nextSeasons.reduce((acc, season) => {
			const currentTimestamp = dayjs(season.date_start).unix();
			
			return currentTimestamp > dayjs(acc.date_end).unix() ? season : acc;
		  }, nextSeasons[0]);

		console.log(nextSeason);

		return (
			<>
				{lastSeason && (
					<LastSeasonCard lastSeason={lastSeason} />
				)}

				{nextSeason && (
					<NextSeasonCard	nextSeason={nextSeason} />
				)}
			</>
		);
	}

	const acc = await getAccount(user.id, cs.id);

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

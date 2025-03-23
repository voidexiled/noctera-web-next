"use server";

import Loading from "@/app/(default)/loading";
import { GuildsProvider } from "@/components/(community)/guilds/context/GuildsContext";
import TableGuild from "@/components/(community)/guilds/guilds-table/GuildsTable";
import { GuildsTableNew } from "@/components/(community)/guilds/guilds-table/GuildsTableNew";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { GlobalConfig } from "@/lib/config";
import { GetManyGuilds } from "@/services/guilds/GuildsService";
import { GetManyPlayers } from "@/services/players/PlayersService";
import type { Prisma, players } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
type SearchParams = Promise<{ page: string | string[] | undefined }>;

export default async function Guilds(props: { searchParams?: SearchParams }) {
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams?.page || "1");

	const session = await getServerSession(authOptions);
	const accountId = session?.user.id;

	let accountCharacters: players[] = [];

	if (accountId) {
		accountCharacters =
			(await GetManyPlayers({
				where: {
					account_id: +accountId,
					level: { gte: GlobalConfig.guilds.minimum_level_to_create ?? 8 },
					guild_membership: null,
					guilds: null,
				},
			})) || [];
	}

	const guilds = await GetManyGuilds({
		include: {
			players: {
				select: {
					name: true,
				},
			},
			guild_membership: {
				include: {
					players: {
						select: {
							name: true,
							level: true,
						},
					},
				},
			},
		},
	});

	const formattedGuilds =
		guilds?.map((guild) => ({
			...guild,
			owner_name: guild.players.name,
			members_amount: guild.guild_membership.length,
			average_level: guild.guild_membership.reduce((acc, curr) => acc + curr.players.level, 0) / guild.guild_membership.length,
		})) ?? [];

	console.log(formattedGuilds);

	return (
		<GuildsProvider>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Guilds</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 ">
					<Suspense fallback={<Loading />}>
						{/* <TableGuild localAccountCharacters={accountCharacters} currentPage={currentPage} /> */}
						<GuildsTableNew guilds={formattedGuilds} localAccountCharacters={accountCharacters} />
					</Suspense>
				</CardContent>
			</Card>
		</GuildsProvider>
	);
}

import { formatTibianMoney } from "@/components/(battlepass)/battlepass/lib/utils";
import { CharactersTable } from "@/components/(community)/characters/character-info/players-list/CharactersTable";

import { InventoryDisplay } from "@/components/(community)/characters/character-info/character-inventory/InventoryDisplay";
import { CharacterStats } from "@/components/(community)/characters/character-info/stats/CharacterStats";
import { CharacterTable } from "@/components/(community)/characters/character-info/table/CharacterTable";
import { DeathsTable } from "@/components/(community)/characters/character-info/table/DeathsTable";
import type { InventorySlotImage } from "@/components/(community)/characters/types/character";
import {
	calculateExperience,
	findEquippedItemImageBySlot,
	generateInventorySlotImageMap,
	retrieveEquippedItemsFromCharacter,
} from "@/components/(community)/characters/utils/characterUtils";
import { EMPTY_SLOTS, SLOTS } from "@/components/(community)/characters/utils/slots";
import { Typography } from "@/components/Typography";
import OutfitComponent from "@/components/animations/OutfitComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { fUnixToDate } from "@/utils/functions/formatDate";
import { getVocation } from "@/utils/functions/getVocations";
import type { Prisma } from "@prisma/client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CharacterPage(props: {
	params: Promise<{ name: string }>;
}) {
	const params = await props.params;
	const player = await prisma.players.findFirst({
		where: {
			AND: [
				{
					name: {
						equals: params.name ? decodeURIComponent(params.name) : undefined,
					},
				},
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
			],
		},
		include: {
			accounts: {
				select: {
					id: true,
					creation: true,
					premdays: true,
					account_bans: true,
					players: {
						where: { hidden: false },
						select: {
							id: true,
							name: true,
							level: true,
							vocation: true,
							sex: true,
							hidden: true,
						},
						orderBy: {
							level: "asc",
						},
					},
				},
			},
			guilds: {
				select: {
					name: true,
					ownerid: true,
					guild_ranks: {
						select: {
							level: true,
						},
					},
				},
			},
			guild_membership: {
				include: {
					guild_ranks: true,
					guilds: true,
				},
			},
			player_items: true,
		},
	});

	if (!player) redirect("/characters");

	const deaths = await prisma.player_deaths.findMany({
		where: { player_id: player.id },
		take: 5,
		orderBy: { time: "desc" },
	});

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Characters</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<CharacterTable player={player} />
				<DeathsTable player={player} deaths={deaths} />
				<CharacterStats player={player} />
				<CharactersTable characters={player.accounts.players} />
			</CardContent>
		</Card>
	);
}

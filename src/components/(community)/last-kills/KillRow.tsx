import { TableCell, TableRow } from "@/components/ui/table";
import { getPlayerById } from "@/services/players/PlayersService";
import { fUnixToDate } from "@/utils/functions/formatDate";
import type { player_deaths } from "@prisma/client";
import Link from "next/link";
import React from "react";

type KillRowProps = {
	death: player_deaths;
	index: number;
};

export const KillRow = async ({ death, index }: KillRowProps) => {
	const player = await getPlayerById(death.player_id, { name: true });
	const playerName = player?.name;
	const deathTime = fUnixToDate(Number(death.time));
	const killerName = death.killed_by;

	return (
		<TableRow key={death.id}>
			<TableCell className="text-right">{index + 1}</TableCell>
			<TableCell className="whitespace-nowrap">{deathTime}</TableCell>
			<TableCell className="w-full">
				<Link href={`/characters/${playerName}`} className="text-blue-500">
					{playerName}
				</Link>{" "}
				died at level <b>{death.level}</b> by{" "}
				{death.is_player ? (
					<>
						a{" "}
						<Link href={`/characters/${killerName}`} className="text-blue-500">
							{killerName}
						</Link>
					</>
				) : (
					killerName
				)}
			</TableCell>
		</TableRow>
	);
};

import type { PlayerJoinGuildMembershipAndAccount } from "@/components/(community)/characters/types/character";
import { Typography } from "@/components/Typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { fUnixToDate } from "@/utils/functions/formatDate";
import type { player_deaths } from "@prisma/client";
import Link from "next/link";

type DeathsTableProps = {
	player: PlayerJoinGuildMembershipAndAccount | null;
	deaths: player_deaths[];
};

export const DeathsTable = ({ player, deaths }: DeathsTableProps) => {
	return (
		<div className="flex flex-col rounded-sm ">
			<div className="flex items-start justify-start bg-background p-2 text-sm">
				Character Deaths
			</div>
			<Table>
				<TableBody>
					{deaths.map((death, index) => {
						return (
							<TableRow key={death.time} className="text-card-foreground/90 text-sm">
								<TableCell className="text-right text-card-foreground/80 text-xs">
									{index + 1}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{fUnixToDate(Number(death.time))}
								</TableCell>
								<TableCell className="w-full">
									{player?.name} died at level <b>{death.level}</b> by {death.is_player && "a "}{" "}
									{death.is_player ? (
										<Link href={`/characters/${death.killed_by}`} className="text-blue-500">
											{death.killed_by}
										</Link>
									) : (
										death.killed_by
									)}{" "}
								</TableCell>
							</TableRow>
						);
					})}

					{deaths.length === 0 && (
						<TableRow>
							<TableCell colSpan={4}>
								<Typography variant="overline" className="text-center text-card-foreground/80">
									Never died.
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

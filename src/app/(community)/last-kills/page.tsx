import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { getLatestKills } from "@/services/common/PlayersCommonService";
import { getPlayerById } from "@/services/players/PlayersService";
import { fUnixToDate } from "@/utils/functions/formatDate";
import Link from "next/link";

export const revalidate = 0;

export default async function LastKillsPage() {
	const deaths = await getLatestKills();
	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Last Kills</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<div className="rounded border">
					<Table>
						<TableBody>
							{deaths.map(async (death, index) => {
								const player = await getPlayerById(death.player_id, {
									name: true,
								});
								return (
									<TableRow key={death.id}>
										<TableCell className="text-right">{index + 1}</TableCell>
										<TableCell className="whitespace-nowrap">
											{fUnixToDate(Number(death.time))}
										</TableCell>
										<TableCell className="w-full">
											<Link href={`/characters/${player?.name}`} className="text-blue-500">
												{player?.name}
											</Link>{" "}
											died at level <b>{death.level}</b> by {death.is_player && "a "}{" "}
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
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

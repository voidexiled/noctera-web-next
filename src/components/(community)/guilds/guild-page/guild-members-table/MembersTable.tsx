import { OnlineStatusBadge } from "@/components/(community)/characters/character-info/players-list/OnlineStatusBadge";
import { RowActions } from "@/components/(community)/guilds/guild-page/guild-members-table/RowActions";
import type {
	MemberRelationWithPlayersAndRanks,
	UserGuildStatus,
} from "@/components/(community)/guilds/types/guilds";
import { Typography } from "@/components/Typography";
import { IconiFy } from "@/components/common/Iconify";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { isPlayerOnline } from "@/services/PlayerIsOnlineService";
import { getVocation } from "@/utils/functions/getVocations";
import type { guild_membership, guild_ranks, players } from "@prisma/client";
import Link from "next/link";

type MembersTableProps = {
	ranks: guild_ranks[];
	members: MemberRelationWithPlayersAndRanks[];
	userStatus: UserGuildStatus;
};

export async function MembersTable({ members, ranks, userStatus }: MembersTableProps) {
	const shouldRenderMemberOptions = userStatus && userStatus.level >= 2;

	return (
		<div className="flex flex-col rounded-sm border">
			<div className="flex items-center justify-between bg-background p-2 text-sm">
				Guild Members
			</div>
			<Table>
				{members.length > 0 && (
					<TableHeader className="pointer-events-none">
						<TableRow>
							<TableCell>Rank</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Vocation</TableCell>
							<TableCell>Level</TableCell>
							<TableCell className="w-[90px] text-center">Status</TableCell>
							{shouldRenderMemberOptions && <TableCell />}
						</TableRow>
					</TableHeader>
				)}
				<TableBody>
					{members
						.sort((a, b) => {
							const nameA = String(a.players.name);
							const nameB = String(b.players.name);
							return nameA.localeCompare(nameB);
						})
						.sort((a, b) => b.guild_ranks.level - a.guild_ranks.level)
						.map((member) => {
							return (
								<TableRow key={member.player_id}>
									<TableCell className="flex flex-row items-center gap-2 whitespace-nowrap">
										<IconiFy
											icon={`game-icons:rank-${member.guild_ranks.level}`}
											className="h-8 w-8"
										/>
										<span>{member.guild_ranks.name}</span>
									</TableCell>
									<TableCell className="w-full">
										<Link
											href={`/characters/${member.players.name}`}
											className="text-blue-500 hover:underline"
										>
											{member.players.name}
										</Link>
										{member.nick && ` ( ${member.nick} )`}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{getVocation(member.players.vocation)}
									</TableCell>
									<TableCell>{member.players.level}</TableCell>
									<TableCell className="w-[90px] text-center">
										{/* check if is player online */}
										{isPlayerOnline(member.players.id).then((online) => (
											<OnlineStatusBadge isOnline={online} />
										))}
									</TableCell>
									{shouldRenderMemberOptions && (
										<TableCell className="w-[90px] text-center">
											<RowActions
												row={member}
												ranks={ranks}
												userStatus={userStatus}
												disabled={false}
											/>
										</TableCell>
									)}
								</TableRow>
							);
						})}
					{members.length === 0 && (
						<TableRow>
							<TableCell colSpan={5}>
								<Typography variant="overline" className="text-center">
									No guild members.
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

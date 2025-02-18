import { CancelInvitationButton } from "@/components/(community)/guilds/guild-page/guild-invited-table/CancelInvitationButton";
import { InvitePlayerButton } from "@/components/(community)/guilds/guild-page/guild-invited-table/InvitePlayerButton";
import type {
	GuildWithInvitations,
	UserGuildStatus,
} from "@/components/(community)/guilds/types/guilds";
import { Typography } from "@/components/Typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

type InvitedTableProps = {
	guild: GuildWithInvitations;
	userStatus: UserGuildStatus;
};

async function getAccountCharacters(account_id: number) {
	const characters = await prisma.players.findMany({
		where: { account_id: account_id },
		select: { id: true },
	});

	return characters;
}

export async function InvitedTable({ guild, userStatus }: InvitedTableProps) {
	const session = await getServerSession(authOptions);
	const sessionCharacters = session?.user.id ? await getAccountCharacters(+session.user.id) : [];
	const sessionPlayerId = sessionCharacters.map((player) => player.id);

	const isLeader = userStatus?.level && userStatus?.level >= 2;
	const isOwner = userStatus?.manager === "owner";

	const isMember = userStatus?.manager === "member" || userStatus?.manager === "owner";

	if (!isMember) return null;

	return (
		<div className="flex flex-col rounded-sm border">
			<div className="flex items-center justify-between bg-background p-2 text-sm">
				Invited Characters
				{isLeader && <InvitePlayerButton guild_id={guild.id} />}
			</div>
			<Table>
				<TableBody>
					{guild.guild_invites.map((invite, index) => {
						const showBtnLeave = sessionPlayerId.includes(invite.player_id);
						return (
							<TableRow key={invite.player_id}>
								<TableCell className="w-full">
									<Link
										href={`/characters/${invite.players.name}`}
										className="text-blue-500 hover:underline"
									>
										{invite.players.name}
									</Link>
								</TableCell>
								<TableCell>
									{session?.user.id && showBtnLeave && !isLeader && (
										<CancelInvitationButton
											guild_id={invite.guild_id}
											player_id={invite.player_id}
										/>
									)}
									{isLeader && (
										<CancelInvitationButton
											guild_id={invite.guild_id}
											player_id={invite.player_id}
										/>
									)}
								</TableCell>
							</TableRow>
						);
					})}
					{guild.guild_invites.length === 0 && (
						<TableRow>
							<TableCell>
								<Typography variant="overline" className="text-center">
									No pending invite members.
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

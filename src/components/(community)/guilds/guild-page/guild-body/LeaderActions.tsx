import { DeleteGuild } from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/DeleteGuild";
import { ManageGuild } from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/ManageGuild";
import { ManageRanks } from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/ManageRanks";
import { ReasignLeadership } from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/ReasignLeadership";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

type LeaderActionsProps = {
	isOwner: boolean;
	accessLevel: number;
	guild_id: number;
};

async function GetGuild(guild_id: number) {
	const g = await prisma.guilds.findUnique({
		where: { id: +guild_id },
		include: {
			guild_membership: true,
			guild_ranks: true,
		},
	});
	return g;
}

export async function LeaderActions({ isOwner, guild_id, accessLevel }: LeaderActionsProps) {
	const session = await getServerSession(authOptions);
	const guild = await GetGuild(guild_id);

	if (session?.user.id && guild && accessLevel >= 2) {
		return (
			<Suspense key={guild.guild_membership.length}>
				<div className="flex flex-col space-y-2 whitespace-nowrap">
					<ManageGuild
						guild={guild}
						defaultValues={{
							banner: `/api/guilds/images/${guild.logo_name}`,
							description: guild.description,
							motd: guild.motd,
						}}
					/>
					<Suspense key={guild.creationdata}>
						<ManageRanks guild={guild} />
					</Suspense>

					{isOwner && (
						<>
							<ReasignLeadership />
							<DeleteGuild guild_id={guild_id} />
						</>
					)}
				</div>
			</Suspense>
		);
	}
}

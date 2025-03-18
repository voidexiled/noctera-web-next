import { Button } from "@/components/ui/button";
import configLua from "@/hooks/useConfigLua";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { CancelInvite } from "@/actions/guilds/actions";
import { GuildLayout } from "@/components/(community)/guilds/guild-page/GuildLayout";
import { GuildBody } from "@/components/(community)/guilds/guild-page/guild-body/GuildBody";
import { GuildHeader } from "@/components/(community)/guilds/guild-page/guild-header/GuildHeader";
import { InvitedTable } from "@/components/(community)/guilds/guild-page/guild-invited-table/InvitedTable";
import { MembersTable } from "@/components/(community)/guilds/guild-page/guild-members-table/MembersTable";
import { getGuildByName } from "@/services/guilds/GuildsService";
import getUserGuildStatus from "../../../../../services/guilds/UserGuildStatusService";

export default async function GuildDataPage(props: {
	params: Promise<{ name: string }>;
}) {
	const params = await props.params;

	const guild = await getGuildByName(decodeURIComponent(params.name));

	if (!guild) redirect(`/guilds/${params.name}`);

	const userStatus = await getUserGuildStatus(guild.id);

	return (
		<GuildLayout
			header={<GuildHeader guild={guild} />}
			body={<GuildBody guild={guild} ownerPlayer={guild.players} userStatus={userStatus} />}
			membersTable={
				<MembersTable
					members={guild.guild_membership}
					ranks={guild.guild_ranks}
					userStatus={userStatus}
				/>
			}
			invitedTable={<InvitedTable guild={guild} userStatus={userStatus} />}
		/>
	);
}

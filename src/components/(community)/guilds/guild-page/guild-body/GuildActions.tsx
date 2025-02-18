import { GuestActions } from "@/components/(community)/guilds/guild-page/guild-body/GuestActions";
import { LeaderActions } from "@/components/(community)/guilds/guild-page/guild-body/LeaderActions";
import type { UserGuildStatus } from "@/components/(community)/guilds/types/guilds";
import type { guilds } from "@prisma/client";

type GuildActionsProps = {
	guild: guilds;
	userStatus: UserGuildStatus;
};
export async function GuildActions({ userStatus, guild }: GuildActionsProps) {
	return (
		<div className="flex flex-col gap-2 rounded border p-2 sm:justify-between md:flex-row">
			<GuestActions guild_name={guild.name} />
			<LeaderActions
				guild_id={guild.id}
				accessLevel={userStatus?.level ?? 0}
				isOwner={userStatus?.manager === "owner"}
			/>
		</div>
	);
}

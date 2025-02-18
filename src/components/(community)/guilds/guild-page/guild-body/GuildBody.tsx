import { GuildActions } from "@/components/(community)/guilds/guild-page/guild-body/GuildActions";
import { GuildInformation } from "@/components/(community)/guilds/guild-page/guild-body/GuildInformation";
import type { UserGuildStatus } from "@/components/(community)/guilds/types/guilds";
import type { guilds } from "@prisma/client";

type GuildBodyProps = {
	guild: guilds;
	ownerPlayer: {
		id: number;
		name: string;
	};
	userStatus: UserGuildStatus;
};

export async function GuildBody({ guild, ownerPlayer, userStatus }: GuildBodyProps) {
	return (
		<div className="flex gap-2 rounded border p-2 sm:justify-between">
			<GuildInformation guild={guild} ownerName={ownerPlayer.name} />
			<GuildActions guild={guild} userStatus={userStatus} />
		</div>
	);
}

import { GuildLogo } from "@/components/(community)/guilds/guild-page/guild-header/GuildLogo";
import { GuildTitle } from "@/components/(community)/guilds/guild-page/guild-header/GuildTitle";
import type { guilds } from "@prisma/client";

type GuildHeaderProps = {
	guild: guilds;
};
export const GuildHeader = ({ guild }: GuildHeaderProps) => {
	return (
		<header className="flex flex-row items-center justify-between p-4">
			<GuildLogo src={`/api/guilds/images/${guild.logo_name}`} className="hidden sm:flex" />
			<GuildTitle title={guild.name} className="flex flex-col justify-center" />
			<GuildLogo src={`/api/guilds/images/${guild.logo_name}`} />
		</header>
	);
};

import type { guild_membership } from "@prisma/client";

export interface Guilds {
	id: number;
	logo: string;
	name: string;
	motd: string;
	description: string;
	logo_name: string;
	players: { name: string };
	guild_membership: guild_membership[];
}

export type PlayerResponse =
	| (accounts & {
			players: players[];
	  })
	| null;

export interface PlayersSelectOptions extends Record<string, string> {}

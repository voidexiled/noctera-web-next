import type { accounts, guild_membership, guilds, players, posts } from "@prisma/client";

export type GuildsTableType = guilds & {
	owner_name: string;
	members_amount: number;
	average_level: number;
	players: {
		name: string;
	};
	guild_membership: (guild_membership & {
		players: {
			level: number;
			name: string;
		};
	})[];
};

export type PlayerResponse =
	| (accounts & {
			players: players[];
	  })
	| null;

export type PlayersSelectOptions = Record<string, string>;

export type GuildWithMembers = guilds & {
	guild_membership: guild_membership[];
};

export type GuildWithRanks = guilds & {
	guild_ranks: guild_ranks[];
};

export type GuildWithMembersAndRanks = guilds & {
	guild_membership: guild_membership[];
	guild_ranks: guild_ranks[];
};

export type UserGuildStatus = {
	isLogged: boolean;
	manager: string;
	level: number;
	player_id: number;
} | null;

export type MemberRelationWithPlayersAndRanks = guild_membership & {
	players: players;
	guild_ranks: guild_ranks;
};

export type GuildWithInvitations = guilds & {
	guild_invites: guild_invites[];
};

export type UpdateGuildMemberRankRequest = {
	rank_id: number;
};

export type UpdateGuildMemberRankResponse = {
	player_name: string;
	rank_name: string;
} | null;

export type KickGuildMemberRequest = {
	guild_id: number;
	player_id: number;
};

export type KickGuildMemberResponse = {
	player_id: number;
	player_name: string;
};

export type InvitePlayerToGuildResponse = {
	player_id: number;
	player_name: string;
};

export type InvitePlayerToGuildErrorResponse = {
	message: string;
};

export type DeleteGuildInviteRequest = {
	guild_id: number;
	player_id: number;
};
export type DeleteGuildInviteResponse = {
	guild_id: number;
	player_id: number;
	player_name: string;
};

export type DeleteGuildInviteErrorResponse = {
	message: string;
};

export type DeleteGuildResponse = {
	guild_id: number;
	guild_name: string;
};
export type DeleteGuildRequest = {
	guild_id: number;
};
export type DeleteGuildError = {
	message: string;
};

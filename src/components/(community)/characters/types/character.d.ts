import type {
	account_bans,
	accounts,
	guild_membership,
	guild_ranks,
	guilds,
	player_items,
	players,
} from "@prisma/client";

/* Inventory */
export type PlayerWithItems = players & {
	player_items: player_items[];
};

export type InventorySlotPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type InventorySlotImage = {
	slotPositionId: InventorySlotPosition;
	imagePath: string;
};

/* Player Information */

export type PlayerJoinGuildMembershipAndAccount =
	| (players & {
			accounts: {
				id: number;
				premdays: number;
				creation: number;
				players: {
					name: string;
					id: number;
					level: number;
					vocation: number;
					sex: number;
					hidden: boolean;
				}[];
				account_bans: player_bans | null;
			};
			guild_membership: {
				guild_ranks: guild_ranks;
				guilds: guilds;
				player_id: number;
				guild_id: number;
				rank_id: number;
				nick: string;
			} | null;
			guilds: {
				name: string;
				guild_ranks: {
					level: number;
				}[];
				ownerid: number;
			} | null;
			player_items: player_items[];
	  })
	| null;

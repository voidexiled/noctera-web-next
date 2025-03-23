// ? ADMINISTRATION ROUTES

import type { Prisma, player_battlepass_rewards_claimed } from "@prisma/client";

export type AdministrationBlogPOSTRequest = {
	title: string;
	content: string;
	category: "BLOG" | "ROADMAP" | "TICKER";
};

export type AdministrationBlogPOSTResponse =
	| undefined
	| {
			message?: string;
	  };

// ? CHARACTER ROUTES

export type CharactersByNameGETRequest = undefined;

export type CharactersByNameGETResponse = {
	characters: Character[];
};

// ? SHOP ROUTES

export type ShopOrdersUpdateStatusPOSTRequest = {
	paymentIntentId: string;
	paymentIntentClientSecret: string;
	newStatus: ORDER_STATUS;
};

export type ShopOrdersUpdateStatusPOSTResponse = {
	status: string;
};

export type ShopStripePaymentIntentsCreatePOSTRequest = {
	currency_code: string;
	value: number;
	description: string;
	product_category_id: number;
	product_amount: number;
};

export type ShopStripePaymentIntentsCreatePOSTResponse = {
	paymentIntent: PaymentIntent;
	orderCreated: boolean;
};

// ? AUTH ROUTES

export type AuthActiveEmailPOSTRequest = {
	token: string;
	code: string;
};
export type AuthActiveEmailPOSTResponse = {
	recovery_key: string;
};

export type AuthResetPasswordPOSTRequest = {
	code: string;
	token: string;
};

export type AuthResetPasswordPOSTResponse = undefined;

export type AuthRecoveryPasswordPOSTRequest = {
	email: string;
};

export type Gender = "male" | "female";

export type AuthRecoveryPasswordPOSTResponse = undefined;

export type AuthRegisterPOSTRequest = {
	name: string;
	email: string;
	password: string;
	gender: Gender;
	characterName: string;
	vocation: string;
	country: string;
	phone: string;
	rlname: string;
};

export type AuthRegisterPOSTResponse = undefined;

// ? ACCOUNTS ROUTES

export type AccountsUpdateEmailPOSTRequest = {
	email: string;
	key: string;
	password: string;
};

export type AccountsUpdateEmailPOSTResponse = undefined;

export type AccountsPlayersByIdDELETERequest = undefined;

export type AccountsPlayersByIdDELETEResponse = undefined;

export type AccountsPlayersByIdPATCHRequest = {
	comment: string | null;
	hidden: boolean;
};

export type AccountsPlayersByIdPATCHResponse = undefined;

export type AccountsTwoFactorTotpDisablePOSTRequest = {
	totpCode: string;
};

export type AccountsTwoFactorTotpDisablePOSTResponse = undefined;

// ? BATTLEPASS ROUTES

export type BattlepassAccountPOSTRequest = {
	id: number;
	season_id: number;
};

export type BattlepassAccountPOSTResponse = {
	account: Prisma.accountsGetPayload<{
		include: {
			players: {
				include: {
					player_battlepass_progress: true;
					player_battlepass_tasks: true;
					player_battlepass_rewards_claimed: true;
				};
			};
		};
	}>;
};

export type BattlepassCharacterPOSTRequest = {
	id: number;
	season_id: number;
};

export type BattlepassCharacterPOSTResponse = {
	player: Prisma.playersGetPayload<{
		select: {
			id: true;
			name: true;
			level: true;
			battlepass_rank: true;
			vocation: true;
		};
		include: {
			player_battlepass_progress: true;
			player_battlepass_tasks: true;
			player_battlepass_rewards_claimed: true;
		};
	}>;
};

export type BattlepassPlayerRewardsCreatePOSTRequest = {
	player_id: number;
	season_id: number;
	reward_id: number;
};

export type BattlepassPlayerRewardsCreatePOSTResponse = {} & player_battlepass_rewards_claimed;

export type BattlepassSeasonCurrentPOSTRequest = undefined;

export type BattlepassSeasonCurrentPOSTResponse = {
	season: Prisma.BattlepassSeasonGetPayload<{
		include: {
			battlepass_seasons_tasks: true;
			battlepass_seasons_rewards: true;
		};
	}>;
};

// ? GUILDS ROUTES

export type GuildsCharactersNameGETRequest = {
	name: string;
};
export type GuildsCharactersNameGETResponse = {
	characters: Character[];
};

export type GuildsImagesFilenameGETRequest = {
	filename: string;
};

export type GuildsImagesFilenameGETResponse = ReadableStream;

export type GuildsInvitationsDELETERequest = {
	guild_id: number;
	player_id: number;
};
export type GuildsInvitationsDELETEResponse = {
	guild_id: number;
	player_id: number;
	player_name: string;
};

export type GuildsManagerPOSTRequest = {
	guild_name: string;
	player_id: number;
};
export type GuildsManagerPOSTResponse = undefined;

export type GuildsManagerDELETERequest = {
	id: string;
};

export type GuildManagerDELETEResponse = {
	guild_id: number;
	guild_name: string;
};

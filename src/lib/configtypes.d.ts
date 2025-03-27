export type ConfigType = {
	new_account: {
		add_transferable_coins: boolean;
		add_coins: boolean;
		add_vip_days: boolean;
		coins_transferable: number;
		coins: number;
		vip_days: number;
	};
	paths: {
		animated_items: string;
		default_guild_logo: string;
	};
	guilds: {
		minimum_level_to_create: number;
		permissive_invite_rank_level: number;
		leader_rank_level: number;
		member_rank_level: number;
		coleader_rank_level: number;
	};
	pid: {
		inventory: number;
		store_inbox: number;
	};
};

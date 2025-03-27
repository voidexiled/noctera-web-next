import type { ConfigType } from "@/lib/configtypes";

export const GlobalConfig: ConfigType = {
	new_account: {
		add_transferable_coins: false,
		coins_transferable: 0,
		add_coins: true,
		coins: 100,
		add_vip_days: true,
		vip_days: 3,
	},
	paths: {
		animated_items: "/animated-items",
		default_guild_logo: "default.gif",
	},
	guilds: {
		minimum_level_to_create: 100,
		permissive_invite_rank_level: 2, // Check db for max level rank to avoid errors: default min 1 (member), 2 (co-lider), max 3 (leader)
		member_rank_level: 1,
		coleader_rank_level: 2,
		leader_rank_level: 3,
	},
	pid: {
		inventory: 103, // pid assignet to the inventory
		store_inbox: 108, // pid assignet to the store inbox
	},
};

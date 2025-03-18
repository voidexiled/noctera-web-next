import type { ConfigType } from "@/lib/configtypes";

export const pageConfig: ConfigType = {
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
	},
	guilds: {
		minimum_level_to_create: 100,
	},
	pid: {
		inventory: 103, // pid assignet to the inventory
		store_inbox: 108, // pid assignet to the store inbox
	},
};

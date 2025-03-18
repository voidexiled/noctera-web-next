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
	};
	guilds: {
		minimum_level_to_create: number;
	};
	pid: {
		inventory: number;
		store_inbox: number;
	};
};

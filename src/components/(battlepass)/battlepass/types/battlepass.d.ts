export type BattlePassLevel = {
	level: number;
	rewards: Array<{
		id: number;
		description: string;
		reward_name: string;
		reward_img: string;
		reward_type: BATTLEPASS_TYPE_REWARDS;
		reward_amount: number;
		reward_value: number;
		reward_should_plus_amount: boolean;
		reward_required_access: BATTLEPASS_RANK_ACCESS;
		visible: boolean;
	}>;
};

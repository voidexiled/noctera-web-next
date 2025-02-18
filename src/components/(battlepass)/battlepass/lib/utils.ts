import { RANK_PRIORITY } from "@/components/(battlepass)/battlepass/lib/consts";
import type { BattlePassLevel } from "@/components/(battlepass)/battlepass/types/battlepass";
import type { ToastProps } from "@/components/ui/toast";
import {
	BATTLEPASS_RANK_ACCESS,
	BATTLEPASS_TYPE_REWARDS,
	BATTLEPASS_TYPE_TASKS,
	type battlepass_seasons_rewards,
	type battlepass_seasons_tasks,
	type player_battlepass_progress,
	type player_battlepass_rewards_claimed,
	type player_battlepass_tasks,
	type players,
} from "@prisma/client";
import dayjs from "dayjs";

export const isDateActive = (currentTimestamp: number, startDate: string, endDate: string) => {
	const startDateTimestamp = dayjs(startDate).unix();
	const endDateTimestamp = dayjs(endDate).unix();

	return currentTimestamp >= startDateTimestamp && currentTimestamp <= endDateTimestamp;
};

export function getTaskPath(task_type: BATTLEPASS_TYPE_TASKS, task_image: string) {
	let basePath = "/battlepass/tasks/";
	switch (task_type) {
		case BATTLEPASS_TYPE_TASKS.MONSTER_KILL:
			basePath = basePath.concat("monsters/");
			break;
		case BATTLEPASS_TYPE_TASKS.ITEM_GET:
			basePath = basePath.concat("items/");
			break;
		case BATTLEPASS_TYPE_TASKS.ITEM_USE:
			basePath = basePath.concat("items/");
			break;
		case BATTLEPASS_TYPE_TASKS.EXP:
			basePath = basePath.concat("exp/");
			break;
		case BATTLEPASS_TYPE_TASKS.OFFER_MARKET:
			basePath = basePath.concat("market/");
			break;
		case BATTLEPASS_TYPE_TASKS.STORAGE:
			basePath = basePath.concat("storage/");
			break;
		default:
			basePath = basePath.concat("unknown/");
			break;
	}
	basePath = basePath.concat(task_image !== "" ? task_image.toString() : "0.gif");

	return basePath;
}

export function getRewardPath(reward_type: BATTLEPASS_TYPE_REWARDS, reward_image: string) {
	let basePath = "/battlepass/rewards/";
	switch (reward_type) {
		case BATTLEPASS_TYPE_REWARDS.ITEM:
			basePath = basePath.concat("items/");
			break;
		case BATTLEPASS_TYPE_REWARDS.MONEY:
			basePath = basePath.concat("money/");
			break;
		case BATTLEPASS_TYPE_REWARDS.EXP:
			basePath = basePath.concat("exp/");
			break;
		case BATTLEPASS_TYPE_REWARDS.COINS:
			basePath = basePath.concat("coins/");
			break;
		case BATTLEPASS_TYPE_REWARDS.COINS_TRANSFERABLE:
			basePath = basePath.concat("coins_transferable/");
			break;
		case BATTLEPASS_TYPE_REWARDS.OUTFIT:
			basePath = basePath.concat("outfits/");
			break;
		case BATTLEPASS_TYPE_REWARDS.MOUNT:
			basePath = basePath.concat("mount/");
			break;
		case BATTLEPASS_TYPE_REWARDS.STORAGE:
			basePath = basePath.concat("storage/");
			break;
		case BATTLEPASS_TYPE_REWARDS.VIP_DAYS:
			basePath = basePath.concat("vip_days/");
			break;
		default:
			basePath = basePath.concat("unknown/");
			break;
	}
	basePath = basePath.concat(reward_image !== "" ? reward_image : "0.gif");

	return basePath;
}

export function groupRewardsByLevel(
	battlepass_rewards: battlepass_seasons_rewards[],
): BattlePassLevel[] {
	const grouped = battlepass_rewards.reduce((acc, reward) => {
		const level = acc.find((l) => l.level === reward.level);
		if (level) {
			level.rewards.push({
				id: reward.id,
				description: reward.description,
				reward_name: reward.reward_name,
				reward_img: reward.reward_img,
				reward_type: reward.reward_type,
				reward_amount: reward.reward_amount,
				reward_value: reward.reward_value,
				reward_should_plus_amount: reward.reward_should_plus_amount,
				reward_required_access: reward.reward_required_access,
				visible: reward.visible,
			});
		} else {
			acc.push({
				level: reward.level,
				rewards: [
					{
						id: reward.id,
						description: reward.description,
						reward_name: reward.reward_name,
						reward_img: reward.reward_img,
						reward_type: reward.reward_type,
						reward_amount: reward.reward_amount,
						reward_value: reward.reward_value,
						reward_should_plus_amount: reward.reward_should_plus_amount,
						reward_required_access: reward.reward_required_access,
						visible: reward.visible,
					},
				],
			});
		}
		return acc;
	}, [] as BattlePassLevel[]);

	return grouped.sort((a, b) => a.level - b.level);
}

export const getDisplayRankTextClassname = (
	rank: (typeof BATTLEPASS_RANK_ACCESS)[keyof typeof BATTLEPASS_RANK_ACCESS] | undefined,
) => {
	if (rank === BATTLEPASS_RANK_ACCESS.FREE) return "text-battlepass-rank-free";
	if (rank === BATTLEPASS_RANK_ACCESS.VIP_SILVER) return "text-battlepass-rank-vip-silver ";
	if (rank === BATTLEPASS_RANK_ACCESS.VIP_GOLD) return "text-battlepass-rank-vip-gold ";
	if (rank === BATTLEPASS_RANK_ACCESS.DIAMOND) return "text-battlepass-rank-diamond ";
	return "";
};

export const getDisplayRankTextContent = (
	rank: (typeof BATTLEPASS_RANK_ACCESS)[keyof typeof BATTLEPASS_RANK_ACCESS] | undefined,
) => {
	if (rank === BATTLEPASS_RANK_ACCESS.FREE) return "";
	if (rank === BATTLEPASS_RANK_ACCESS.VIP_SILVER) return ": una elección noble.";
	if (rank === BATTLEPASS_RANK_ACCESS.VIP_GOLD) return ": brilla como el oro.";
	if (rank === BATTLEPASS_RANK_ACCESS.DIAMOND) return ": lo mejor para los mejores.";
	return "unknown rank.";
};

export const playerIsRank = (
	player:
		| (players & {
				player_battlepass_progress: player_battlepass_progress[];
				player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
				player_battlepass_tasks: player_battlepass_tasks[];
		  })
		| players,
	rank: BATTLEPASS_RANK_ACCESS,
) => {
	return player?.battlepass_rank === rank;
};

type BattlepassTasksSortByType = "battlepass_exp_reward";

type BattlepassTasksOrderByType = "ascending" | "descending";

export const getBattlepassTasksSorted = (
	tasks: battlepass_seasons_tasks[],
	sort_by: BattlepassTasksSortByType,
	order_by: BattlepassTasksOrderByType,
) => {
	if (sort_by === "battlepass_exp_reward") {
		return tasks.toSorted((a, b) => {
			if (order_by === "descending")
				return a.task_battlepass_exp_reward - b.task_battlepass_exp_reward;
			if (order_by === "ascending")
				return b.task_battlepass_exp_reward - a.task_battlepass_exp_reward;

			return a.task_battlepass_exp_reward - b.task_battlepass_exp_reward;
		});
	}
	return tasks;
};

export const getPlayerBattlepassTask = (
	player: players & {
		player_battlepass_tasks: player_battlepass_tasks[];
	},
	task_id: number,
) => {
	return player.player_battlepass_tasks.find((p) => p.task_id === task_id);
};

type BattlepassRewardsSortByType = "level";
type BattlepassRewardsOrderByType = "ascending" | "descending";

export const getBattlepassRewardsSorted = (
	rewards: battlepass_seasons_rewards[],
	sort_by: BattlepassRewardsSortByType,
	order_by: BattlepassRewardsOrderByType,
) => {
	if (sort_by === "level") {
		return rewards.toSorted((a, b) => {
			if (order_by === "descending") return a.level - b.level;
			if (order_by === "ascending") return b.level - a.level;

			return a.level - b.level;
		});
	}
	return rewards;
};

export const groupBattlepassRewardsByLevel = (
	rewards: battlepass_seasons_rewards[],
): BattlePassLevel[] => {
	const grouped = rewards.reduce((acc, reward) => {
		const level = acc.find((l) => l.level === reward.level);
		if (level) {
			level.rewards.push({
				id: reward.id,
				description: reward.description,
				reward_name: reward.reward_name,
				reward_img: reward.reward_img,
				reward_type: reward.reward_type,
				reward_amount: reward.reward_amount,
				reward_value: reward.reward_value,
				reward_should_plus_amount: reward.reward_should_plus_amount,
				reward_required_access: reward.reward_required_access,
				visible: reward.visible,
			});
		} else {
			acc.push({
				level: reward.level,
				rewards: [
					{
						id: reward.id,
						description: reward.description,
						reward_name: reward.reward_name,
						reward_img: reward.reward_img,
						reward_type: reward.reward_type,
						reward_amount: reward.reward_amount,
						reward_value: reward.reward_value,
						reward_should_plus_amount: reward.reward_should_plus_amount,
						reward_required_access: reward.reward_required_access,
						visible: reward.visible,
					},
				],
			});
		}
		return acc;
	}, [] as BattlePassLevel[]);

	return grouped.sort((a, b) => a.level - b.level);
};

export const formatTibianMoney = (amount: number, long?: boolean): string => {
	if (!long) {
		const k = 1000;
		const kk = k * k;
		const kkk = k * kk;

		if (amount < k) {
			return `${amount} gold coins.`;
		}
		if (amount < kk) {
			return `${(amount / k).toFixed(amount % k === 0 ? 0 : 1)}k`;
		}
		if (amount < kkk) {
			return `${(amount / kk).toFixed(amount % kk === 0 ? 0 : 1)}kk`;
		}
		return `${(amount / kkk).toFixed(amount % kkk === 0 ? 0 : 1)}kkk`;
	}

	// long version is like 1,000,000 gold coins

	return `${numberWithCommas(amount.toString())} gold coins.`;
};

export function numberWithCommas(x: string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getRewardSuccessfullyClaimedText = (battlepass_reward: battlepass_seasons_rewards) => {
	const { reward_type, reward_name, reward_amount } = battlepass_reward;

	if (reward_type === "ITEM") {
		return `You have received the item ${reward_name} x${reward_amount} in your mailbox.`;
	}
	if (reward_type === "MONEY") {
		return `You have received ${formatTibianMoney(reward_amount)} in your bank account.`;
	}
	if (reward_type === "EXP") {
		return `You have received an EXP card with ${reward_amount} experience points in your mailbox.`;
	}
	if (reward_type === "COINS") {
		return `You have received ${reward_amount} coins in your account.`;
	}
	if (reward_type === "COINS_TRANSFERABLE") {
		return `You have received ${reward_amount} noctera coins in your account.`;
	}
	if (reward_type === "MOUNT") {
		return `You have received the mount named ${reward_name} in your character.`;
	}
	if (reward_type === "OUTFIT") {
		return `You have received the outfit named ${reward_name} in your character.`;
	}
	if (reward_type === "VIP_DAYS") {
		return `You have received ${reward_amount} days of VIP time in your account.`;
	}
	if (reward_type === "STORAGE") {
		//return `You have received a storage named ${reward.reward_name} in your account.`;
		return "todo: storage";
	}
};

export const hasAccessToReward = (
	player_rank: BATTLEPASS_RANK_ACCESS,
	reward_required_rank: BATTLEPASS_RANK_ACCESS,
) => {
	return RANK_PRIORITY[player_rank] >= RANK_PRIORITY[reward_required_rank];
};

export const claimRewards = async (
	player: players & {
		player_battlepass_progress: player_battlepass_progress[];
		player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
		player_battlepass_tasks: player_battlepass_tasks[];
	},
	hasAccess: boolean,
	isLocked: boolean,
	isClaimed: boolean,
	hasRemainingRewards: boolean,
	battlepassLevel: BattlePassLevel,
	successToast: (reward: battlepass_seasons_rewards) => void,
	errorToast: (reward: battlepass_seasons_rewards) => void,
) => {
	if (!hasAccess || isLocked || !hasRemainingRewards) return;
	let _isClaimed: boolean = isClaimed;
	let _hasRemainingRewards: boolean = hasRemainingRewards;
	const claimRewardsIds = player.player_battlepass_rewards_claimed.map(
		(reward) => reward.reward_id,
	);
	const availableRewards = battlepassLevel.rewards.filter(
		(rew) =>
			hasAccessToReward(player.battlepass_rank, rew.reward_required_access) &&
			!claimRewardsIds.includes(rew.id),
	);
	console.log("availableRewards", availableRewards);

	for (const rew of availableRewards) {
		const res = await fetch("/api/battlepass/player/rewards/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				player_id: player.id,
				season_id: player.player_battlepass_progress[0].season_id,
				reward_id: rew.id,
			}),
		});

		if (res.ok) {
			_isClaimed = true;
			_hasRemainingRewards = false;

			successToast(rew as battlepass_seasons_rewards);
		} else {
			errorToast(rew as battlepass_seasons_rewards);
		}
		return { isClaimed: _isClaimed, hasRemainingRewards: _hasRemainingRewards };
	}
};

// export const claimRewards = async (
// 	player: players & {
// 		player_battlepass_progress: player_battlepass_progress[];
// 		player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
// 		player_battlepass_tasks: player_battlepass_tasks[];
// 	},
// 	hasAccess: boolean,
// 	isLocked: boolean,
// 	isClaimed: boolean,
// 	hasRemainingRewards: boolean,
// 	reward: BattlePassLevel,
// 	successToast: (reward: battlepass_seasons_rewards) => void,
// 	errorToast: (reward: battlepass_seasons_rewards) => void,
// ) => {
// 	if (!hasAccess || isLocked || isClaimed) return;
// 	let _isClaimed: boolean = isClaimed;
// 	let _hasRemainingRewards: boolean = hasRemainingRewards;
// 	const availableRewards = reward.rewards.filter((rew) =>
// 		hasAccessToReward(player.battlepass_rank, rew.reward_required_access),
// 	);

// 	for (const rew of availableRewards) {
// 		const res = await fetch("/api/battlepass/player/rewards/create", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				player_id: player.id,
// 				season_id: player.player_battlepass_progress[0].season_id,
// 				reward_id: rew.id,
// 			}),
// 		});

// 		if (res.ok) {
// 			_isClaimed = true;
// 			_hasRemainingRewards = false;
// 			successToast(rew as battlepass_seasons_rewards);
// 		} else {
// 			errorToast(rew as battlepass_seasons_rewards);
// 		}

// 		return { isClaimed: _isClaimed, hasRemainingRewards: _hasRemainingRewards };
// 		// else
// 		// 	toast(
// 		// 				title: "Error!",
// 		// 				description: <div className="">Error claiming reward.</div>,);
// 		// };
// 	}
// };

export const calculateCurrentItemRemainingRewards = (
	player: players & {
		player_battlepass_progress: player_battlepass_progress[];
		player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
		player_battlepass_tasks: player_battlepass_tasks[];
	},
	battlepass_level: BattlePassLevel,
) => {
	const battlepassLevelRewardsIds = battlepass_level.rewards.map((reward) => reward.id);
	const totalRewards = battlepass_level.rewards.filter((reward) => {
		return hasAccessToReward(player.battlepass_rank, reward.reward_required_access);
	});

	const claimedRewards = player.player_battlepass_rewards_claimed.filter((reward) =>
		battlepassLevelRewardsIds.includes(reward.reward_id),
	);

	console.log("claimed", claimedRewards.length);
	console.log(totalRewards.length);
	return totalRewards.length > claimedRewards.length;
};

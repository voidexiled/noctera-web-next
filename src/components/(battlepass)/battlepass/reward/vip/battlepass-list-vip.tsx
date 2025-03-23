"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { groupBattlepassRewardsByLevel } from "@/components/(battlepass)/battlepass/lib/utils";
import { BattlepassRewardVip } from "@/components/(battlepass)/battlepass/reward/vip/battlepass-item-vip";
import { useContext } from "react";

export const BattlepassRewardsVipList = () => {
	const { currentSeason } = useContext(BattlepassContext) as BattlepassContextType;

	const groupedRewards = groupBattlepassRewardsByLevel(
		currentSeason.battlepass_seasons_rewards
			.filter((reward) => reward.reward_required_access !== "FREE")
			.sort((a, b) => a.level - b.level),
	);

	return (
		<div className="flex min-h-[165px] flex-row ">
			{/* TODO: sort by level */}
			{groupedRewards.map((reward) => {
				return (
					<BattlepassRewardVip key={`${reward.level}-vip-reward-item`} battlepassLevel={reward} />
				);
			})}
		</div>
	);
};

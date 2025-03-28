"use client";

import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { groupBattlepassRewardsByLevel } from "@/components/(battlepass)/battlepass/lib/utils";
import { BattlepassRewardFree } from "@/components/(battlepass)/battlepass/reward/free/battlepass-item-free";
import { useContext } from "react";

export const BattlepassRewardsFreeList = () => {
	const { currentSeason } = useContext(BattlepassContext) as BattlepassContextType;

	const groupedRewards = groupBattlepassRewardsByLevel(
		currentSeason.battlepass_seasons_rewards
			.filter((reward) => reward.reward_required_access === "FREE")
			.sort((a, b) => a.level - b.level),
	);

	return (
		<div className="flex min-h-[165px] flex-row ">
			{/* TODO: sort by level */}
			{groupedRewards.map((reward) => {
				return (
					<BattlepassRewardFree key={`${reward.level}-free-reward-item`} battlepassLevel={reward} />
				);
			})}
		</div>
	);
};

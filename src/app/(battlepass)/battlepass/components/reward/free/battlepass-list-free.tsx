"use client"
import { BattlepassContext, type BattlepassContextType } from "@/app/(battlepass)/battlepass/components/context/BattlepassContext";
import { BattlepassRewardFree } from "@/app/(battlepass)/battlepass/components/reward/free/battlepass-item-free";
import { BattlepassRewardVip } from "@/app/(battlepass)/battlepass/components/reward/vip/battlepass-item-vip";
import { groupBattlepassRewardsByLevel } from "@/app/(battlepass)/battlepass/lib/utils";
import { useContext } from "react";

export const BattlepassRewardsFreeList = () => {
    const {currentSeason} = useContext(BattlepassContext) as BattlepassContextType;

    const groupedRewards = groupBattlepassRewardsByLevel(
        currentSeason.battlepass_seasons_rewards.filter((reward) => reward.reward_required_access === "FREE").sort((a, b) => a.level - b.level))

	return (
		<div className="flex flex-row ">
			{/* TODO: sort by level */}
			{groupedRewards
				.map((reward) => {
					return (
						<BattlepassRewardFree
                            key={`${reward.level}-free-reward-item`}
							battlepassLevel={reward}
						/>
					);
				})}
		</div>
	);
};



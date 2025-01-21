"use client"
import { BattlepassContext, type BattlepassContextType } from "@/app/(battlepass)/battlepass/components/context/BattlepassContext";
import { BattlepassRewardVip } from "@/app/(battlepass)/battlepass/components/reward/vip/battlepass-item-vip";
import { groupBattlepassRewardsByLevel } from "@/app/(battlepass)/battlepass/lib/utils";
import { useContext } from "react";

export const BattlepassRewardsVipList = () => {
    const {currentSeason} = useContext(BattlepassContext) as BattlepassContextType;
    
	const groupedRewards = groupBattlepassRewardsByLevel(
		currentSeason.battlepass_seasons_rewards
			.filter((reward) => reward.reward_required_access !== "FREE")
			.sort((a, b) => a.level - b.level),
	);

	return (
		<div className="flex flex-row ">
			{/* TODO: sort by level */}
			{groupedRewards.map((reward) => {
				return (
					<BattlepassRewardVip
                    key={`${reward.level}-vip-reward-item`}
                    battlepassLevel={reward}
						
					/>
				);
			})}
		</div>
	);
};

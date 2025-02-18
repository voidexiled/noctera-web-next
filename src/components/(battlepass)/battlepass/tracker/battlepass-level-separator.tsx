"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { groupBattlepassRewardsByLevel } from "@/components/(battlepass)/battlepass/lib/utils";
import { cn } from "@/lib/utils";
import { useContext } from "react";

export const BattlepassLevelSeparator = () => {
	const { selectedPlayer, currentSeason, playerCurrentBattlepassLevel } = useContext(
		BattlepassContext,
	) as BattlepassContextType;

	const groupedRewards = groupBattlepassRewardsByLevel(currentSeason.battlepass_seasons_rewards);

	return (
		<div
			className="z-40 flex h-full flex-row items-start justify-center bg-card/80 font-bold "
			style={{
				width: groupedRewards.length * 182,
			}}
		>
			{groupedRewards.map((reward, index) => {
				const levelPassed = reward.level <= playerCurrentBattlepassLevel;
				return (
					<div
						key={reward.level.toString().concat("-level-separator")}
						className={cn(
							"flex h-full flex-row items-center justify-center",
							levelPassed && "bg-primary/80",
						)}
						style={{
							width: 182,
						}}
					>
						<div
							className={cn(
								"no-draggable no-selectable relative flex h-8 w-8 items-center justify-center rounded-full bg-accent-foreground text-center font-bold text-accent text-xs",
								levelPassed && "bg-primary text-primary-foreground",
							)}
						>
							{reward.level}
						</div>
					</div>
				);
			})}
		</div>
	);
};

import {
	getDisplayRankTextClassname,
	playerIsRank,
} from "@/components/(battlepass)/battlepass/lib/utils";
import SparklesText from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
import type {
	player_battlepass_progress,
	player_battlepass_rewards_claimed,
	player_battlepass_tasks,
	players,
} from "@prisma/client";

export const BattlepassRankBadge = ({ selectedPlayer }: { selectedPlayer: players }) => {
	return (
		<>
			{!playerIsRank(selectedPlayer, "FREE") ? (
				<SparklesText
					className={cn(
						"font-sans text-base",
						getDisplayRankTextClassname(selectedPlayer.battlepass_rank),
					)}
					sparklesCount={25}
					text={selectedPlayer.battlepass_rank as string}
				/>
			) : (
				<strong
					className={cn(
						"font-sans",
						getDisplayRankTextClassname(selectedPlayer.battlepass_rank),
						!playerIsRank(selectedPlayer, "FREE") && "font-bold",
					)}
				>
					{selectedPlayer.battlepass_rank}
				</strong>
			)}
		</>
	);
};

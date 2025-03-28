"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import {
	getBattlepassTasksSorted,
	getPlayerBattlepassTask,
} from "@/components/(battlepass)/battlepass/lib/utils";
import { BattlepassTask } from "@/components/(battlepass)/battlepass/task/task-item";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useContext } from "react";

export const BattlepassTaskList = () => {
	const { currentSeason, selectedPlayer } = useContext(BattlepassContext) as BattlepassContextType;
	return (
		<ScrollArea className="relative mr-auto w-full scroll-smooth" scrollHideDelay={3000}>
			<div className="mb-4 flex flex-row py-2 pl-4">
				{getBattlepassTasksSorted(
					currentSeason.battlepass_seasons_tasks,
					"battlepass_exp_reward",
					"descending",
				).map((task) => {
					return (
						<BattlepassTask
							key={`${task.id}-task`}
							task={task}
							playerTask={getPlayerBattlepassTask(selectedPlayer, task.id)}
						/>
					);
				})}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
};

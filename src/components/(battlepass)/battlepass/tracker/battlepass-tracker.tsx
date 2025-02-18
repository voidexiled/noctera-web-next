"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { BattlepassRewardsFreeList } from "@/components/(battlepass)/battlepass/reward/free/battlepass-list-free";
import { BattlepassRewardsVipList } from "@/components/(battlepass)/battlepass/reward/vip/battlepass-list-vip";

import { BattlepassLevelSeparator } from "@/components/(battlepass)/battlepass/tracker/battlepass-level-separator";
import { BattlepassProgressBar } from "@/components/(battlepass)/battlepass/tracker/battlepass-progressbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useContext } from "react";

export const BattlepassTracker = () => {
	const { selectedPlayer, currentSeason } = useContext(BattlepassContext) as BattlepassContextType;

	return (
		<div className="mb-12 grid h-auto w-full grid-cols-1 grid-rows-[65px_1fr] gap-4 overflow-hidden rounded-md border ">
			<BattlepassProgressBar />
			<ScrollArea className=" mr-auto w-full scroll-smooth border-t" scrollHideDelay={3000}>
				<ScrollBar orientation="horizontal" className="z-50" />
				<div className="relative grid grid-cols-1 grid-rows-[1fr_5px_1fr] rounded-md bg-background/50 ">
					<div
						className="-z-10 fixed top-0 left-0 h-full w-full"
						style={{
							background: `url('/battlepass/${currentSeason.background_img}') no-repeat center`,
							backgroundSize: "cover",
							backgroundPosition: "center",

							opacity: 0.5,
						}}
					/>
					<BattlepassRewardsVipList />

					<BattlepassLevelSeparator />

					<BattlepassRewardsFreeList />
				</div>
			</ScrollArea>
		</div>
	);
};

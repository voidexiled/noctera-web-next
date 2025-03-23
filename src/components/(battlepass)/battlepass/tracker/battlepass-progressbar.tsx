"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import type { battlepass_seasons, player_battlepass_progress } from "@prisma/client";
import { motion } from "framer-motion";
import { useContext, useEffect } from "react";

export const BattlepassProgressBar = () => {
	const {
		selectedPlayer,
		playerCurrentBattlepassLevel,
		battlepassRequiredExperienceForLevelUp,
		battlepassMaxLevel,
	} = useContext(BattlepassContext) as BattlepassContextType;

	if (!selectedPlayer.player_battlepass_progress[0]) {
		return null;
	}

	const playerExp = selectedPlayer.player_battlepass_progress
		? selectedPlayer.player_battlepass_progress[0].current_exp
		: 0;

	return (
		<div className="flex h-full w-full flex-row items-center justify-center gap-4 px-2 pt-3 pb-1 text-center text-card-foreground/80">
			<span>{playerCurrentBattlepassLevel}</span>
			<div className="relative flex h-8 grow flex-row items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-background/80 to-card/80">
				<motion.div
					className="absolute top-0 left-0 h-full bg-linear-to-r from-accent/80 to-primary/80 transition-all "
					initial={{ width: "0%" }}
					animate={{
						width: `${playerExp % battlepassRequiredExperienceForLevelUp}%`,
					}}
					transition={{
						duration: 1,
						ease: "circInOut",
						type: "spring",
						delay: 0.1,
					}}
					// style={{
					// 	width: `${playerExp % battlepassRequiredExperienceForLevelUp}%`,
					// }}
				/>
				<div className="z-10 flex flex-row items-center justify-center gap-2 text-foreground/80">
					<span>{playerExp % battlepassRequiredExperienceForLevelUp}</span>
					<span>/</span>
					<span>{battlepassRequiredExperienceForLevelUp}</span>
				</div>
			</div>
			<span>{playerCurrentBattlepassLevel + 1}</span>
		</div>
	);
};

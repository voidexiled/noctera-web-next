"use client";
import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/app/(battlepass)/battlepass/components/context/BattlepassContext";
import {
	calculateCurrentItemRemainingRewards,
	claimRewards,
	getDisplayRankTextClassname,
	getRewardPath,
	getRewardSuccessfullyClaimedText,
	hasAccessToReward,
	playerIsRank,
} from "@/app/(battlepass)/battlepass/lib/utils";
import type { BattlePassLevel } from "@/app/(battlepass)/battlepass/types";
import SparklesText from "@/components/ui/sparkles-text";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
	BATTLEPASS_RANK_ACCESS,
	BATTLEPASS_TYPE_REWARDS,
	type battlepass_seasons_rewards,
} from "@prisma/client";
import { useContext, useEffect, useState } from "react";
type BattlepassRewardFreeType = {
	battlepassLevel: BattlePassLevel;
};
export const BattlepassRewardFree = ({
	battlepassLevel,
}: BattlepassRewardFreeType) => {
	const { selectedPlayer, playerCurrentBattlepassLevel } = useContext(
		BattlepassContext,
	) as BattlepassContextType;

	const { toast } = useToast();

	const [currentRewardShowed, setCurrentRewardShowed] = useState<number>(0);

	const [hasRemainingRewards, setHasRemainingRewards] = useState<boolean>(true);

	const [isClaimed, setIsClaimed] = useState<boolean>(
		selectedPlayer.player_battlepass_rewards_claimed.some((claimed) =>
			battlepassLevel.rewards.some((r) => r.id === claimed.reward_id),
		),
	);

	const isLocked = battlepassLevel.level > playerCurrentBattlepassLevel;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentRewardShowed(
				(prev) => (prev + 1) % battlepassLevel.rewards.length,
			);
		}, 3000);

		return () => clearInterval(interval);
	}, [battlepassLevel.rewards.length]);

	useEffect(() => {
		setHasRemainingRewards(
			calculateCurrentItemRemainingRewards(selectedPlayer, battlepassLevel),
		);
	}, [
		battlepassLevel.rewards.length,
		selectedPlayer.player_battlepass_rewards_claimed.length,
	]);

	const successToast = (reward: battlepass_seasons_rewards) => {
		toast({
			title: "Reward claimed!",
			description: (
				<div className="">
					You have claimed successfully the reward.
					<br />
					{getRewardSuccessfullyClaimedText(reward)}
				</div>
			),
		});
	};

	const errorToast = (reward: battlepass_seasons_rewards) => {
		toast({
			title: "Error!",
			description: <div className="">Error claiming reward.</div>,
		});
	};

	return (
		<div
			onClick={() => {
				claimRewards(
					selectedPlayer,
					true,
					isLocked,
					isClaimed,
					hasRemainingRewards,
					battlepassLevel,
					successToast,
					errorToast,
				).then((value) => {
					if (value) {
						setIsClaimed(true);
						setHasRemainingRewards(false);
					}
				});
			}}
			className={cn(
				"no-draggable no-selectable group relative grid h-full min-w-[182px] cursor-pointer grid-cols-1 grid-rows-[1fr_35px] px-4 py-3 transition-colors duration-100 ease-in-out hover:bg-background active:bg-background/65",
				isLocked && " reward-locked pointer-events-none bg-background",
				isClaimed &&
					!hasRemainingRewards &&
					" pointer-events-none bg-primary/40 ",
			)}
		>
			<img
				alt="locked reward"
				className={cn(
					"absolute top-[5px] right-[5px] hidden",
					isLocked && "flex",
				)}
				width={20}
				height={29}
				src={"/battlepass/lock_free.png"}
			/>
			<img
				alt="claimed reward"
				className={cn(
					"absolute top-[5px] right-[5px] hidden antialiased opacity-80 ",
					isClaimed && !hasRemainingRewards && "flex",
				)}
				width={32}
				height={32}
				src={"/battlepass/claimed.png"}
			/>
			<div
				className={cn(
					"group relative grid h-[165px] w-[150px] grid-cols-1 grid-rows-[1fr_40px] overflow-hidden p-2 transition-all ",
				)}
			>
				<div className="relative flex flex-col items-center justify-center">
					{battlepassLevel.rewards.map((rew, index) => {
						const stackIndex =
							(index - currentRewardShowed + battlepassLevel.rewards.length) %
							battlepassLevel.rewards.length;
						const isCurrent = stackIndex === 0;

						const isOutfit = rew.reward_type === BATTLEPASS_TYPE_REWARDS.OUTFIT;
						const outfitSrc = isOutfit ? rew.reward_img.split(";") : "";
						const maleSrc = isOutfit ? outfitSrc[0] : "";
						const femaleSrc = isOutfit ? outfitSrc[1] : "";
						const finalSrc = isOutfit
							? outfitSrc !== ""
								? selectedPlayer.sex === 0
									? maleSrc
									: femaleSrc
								: rew.reward_img
							: rew.reward_img;

						return (
							<img
								loading="lazy"
								key={rew.id}
								src={getRewardPath(rew.reward_type, finalSrc)}
								alt={rew.reward_name}
								width={64}
								height={64}
								className={cn(
									"absolute p-1 transition-all duration-500 ease-in-out",
									isCurrent && "z-10",
									!hasAccessToReward(
										selectedPlayer.battlepass_rank,
										rew.reward_required_access,
									) && "grayscale-[100%]",
								)}
								style={{
									zIndex: isCurrent ? 10 : 10 - stackIndex,
									transform: isCurrent
										? "scale(1) translateY(0)"
										: `scale(${1 - stackIndex * 0.16}) `,
									opacity: isCurrent
										? hasAccessToReward(
												selectedPlayer.battlepass_rank,
												rew.reward_required_access,
											)
											? 1
											: 1
										: 1 - stackIndex * 0.35,
								}}
							/>
						);
					})}
				</div>
				<div className="relative flex flex-col items-center justify-start">
					{battlepassLevel.rewards.map((rew, index) => {
						const stackIndex =
							(index - currentRewardShowed + battlepassLevel.rewards.length) %
							battlepassLevel.rewards.length;
						const isCurrent = stackIndex === 0;
						return (
							<div
								key={`${rew.id}-${index}-reward-name`}
								className={cn(
									"absolute z-10 flex flex-row items-end justify-center gap-1 text-center font-bold text-secondary-foreground/60 text-xs transition-all duration-500 ease-in-out",
									isCurrent && "z-10 opacity-100",
								)}
								style={{
									zIndex: isCurrent ? 10 : 10 - stackIndex,
									transform: isCurrent
										? "scale(1) translateY(0)"
										: `scale(${1 - stackIndex * 0.16}) `,
									opacity: isCurrent ? 1 : 0,
								}}
							>
								<span
									className={cn(
										!hasAccessToReward(
											selectedPlayer.battlepass_rank,
											rew.reward_required_access,
										) && "line-through",
										getDisplayRankTextClassname(rew.reward_required_access),
									)}
								>
									{rew.reward_name} x {rew.reward_amount}
								</span>
							</div>
						);
					})}
				</div>
				{/* <img
					src={getRewardPath(battle.reward_type, reward.reward_img)}
					alt={reward.reward_name}
					width={64}
					height={64}
					className="no-draggable no-selectable m-auto rounded-sm bg-background/0 p-1 transition-all group-hover:scale-[1.03] group-hover:drop-shadow-2xl"
				/>
				<div className="z-10 flex flex-row items-end justify-center gap-1 text-center text-secondary-foreground/60 text-xs ">
					<span className="">{reward.reward_name}</span>
					<span className="">x {reward.reward_amount}</span>
				</div> */}
			</div>

			{hasRemainingRewards && !isLocked && (
				<div className="flex h-full w-full items-center justify-center">
					<span className="font-bold text-accent/80 transition-all group-hover:opacity-80 group-active:text-accent group-active:opacity-100">
						Click to claim
					</span>
				</div>
			)}
		</div>
	);
};

"use client";

import {
	BattlepassContext,
	type BattlepassContextType,
} from "@/app/(battlepass)/battlepass/components/context/BattlepassContext";
import {
	CustomCard,
	CustomCardContent,
	CustomCardHeader,
} from "@/app/(battlepass)/battlepass/components/custom-card";
import { BattlepassTaskList } from "@/app/(battlepass)/battlepass/components/task/task-list";
import { BattlepassTracker } from "@/app/(battlepass)/battlepass/components/tracker/battlepass-tracker";
import {
	getDisplayRankTextClassname,
	playerIsRank,
} from "@/app/(battlepass)/battlepass/lib/utils";
import { IconiFy } from "@/components/Iconify";
import { FormProvider, RHFSelect } from "@/components/hook-form";
import SparklesText from "@/components/ui/sparkles-text";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import type {
	accounts,
	battlepass_seasons,
	battlepass_seasons_rewards,
	battlepass_seasons_tasks,
	player_battlepass_progress,
	player_battlepass_rewards_claimed,
	player_battlepass_tasks,
	players,
} from "@prisma/client";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CharacterBattlepassType = {
	acc: accounts & {
		players: (players & {
			player_battlepass_progress: player_battlepass_progress[];
			player_battlepass_tasks: player_battlepass_tasks[];
			player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
		})[];
	};
	cs: battlepass_seasons & {
		battlepass_seasons_rewards: battlepass_seasons_rewards[];
		battlepass_seasons_tasks: battlepass_seasons_tasks[];
	};
};

export function CharacterBattlepass() {
	const {
		account,
		currentSeason,
		selectedPlayer,
		setSelectedPlayer,
		setAccount,
		setCurrentSeason,
		refetchSeason,
		refetchAccount,
	} = useContext(BattlepassContext) as BattlepassContextType;

	// setAccount(acc);
	// setCurrentSeason(cs);
	// setSelectedPlayer(acc.players[0] ?? null);

	const BattlepassFormSchema = z.object({
		character_name: z.string(),
	});

	type battlepassFormValues = z.infer<typeof BattlepassFormSchema>;

	const methods = useForm<battlepassFormValues>({
		defaultValues: {
			character_name: account.players
				? account.players.length > 0
					? account.players[0].name
					: ""
				: "",
		},
	});

	const {
		reset,
		handleSubmit,
		watch,
		setValue,
		formState: { isSubmitting },
	} = methods;
	const values = watch();

	useEffect(() => {
		const findCharacter = async () => {
			const _findedCharacter = account.players.find(
				(c) => c.name === values.character_name,
			);
			if (!_findedCharacter) return;

			try {
				console.log("id: ", _findedCharacter.id, typeof _findedCharacter.id);
				console.log("season_id: ", currentSeason.id, typeof currentSeason.id);

				const _updatedCharacter = await fetch("api/battlepass/character", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: _findedCharacter.id,
						season_id: currentSeason.id,
					}),
				})
					.then((res) => res.json())
					.catch((err) => {
						console.log(err);
						return { character: null };
					});

				if (_updatedCharacter) {
					refetchSeason();
					setSelectedPlayer(_updatedCharacter.player);
				}
				console.log("_updatedCharacter", _updatedCharacter);
			} catch (error) {
				console.log(error);
			}
		};
		findCharacter();
		console.log("name is changed to ", values.character_name);
	}, [values.character_name]);

	if (!account || !account.players || !account.players.length || !currentSeason)
		return <></>;

	return (
		<>
			<CustomCard>
				<CustomCardHeader>
					<span className="font-bold">{currentSeason.season_name}</span>

					{!playerIsRank(selectedPlayer, "FREE") ? (
						<SparklesText
							className={cn(
								"font-sans text-base",
								getDisplayRankTextClassname(selectedPlayer?.battlepass_rank),
							)}
							sparklesCount={25}
							text={selectedPlayer?.battlepass_rank as string}
						/>
					) : (
						<strong
							className={cn(
								"font-sans",
								getDisplayRankTextClassname(selectedPlayer?.battlepass_rank),
								!playerIsRank(selectedPlayer, "FREE") && "font-bold",
							)}
						>
							{selectedPlayer?.battlepass_rank}
						</strong>
					)}
				</CustomCardHeader>
				<CustomCardContent className="border-b">
					<span className="text-card-foreground/90 text-sm">
						{currentSeason.description}
					</span>
				</CustomCardContent>
				{/* <CustomCardContent>
					<div className="flex items-center gap-2">
						<IconiFy icon={"ph:check-circle"} />
						<IconiFy icon={"ph:check-circle"} />
					</div>
				</CustomCardContent> */}
			</CustomCard>
			<CustomCard>
				<CustomCardHeader>Select character</CustomCardHeader>
				<CustomCardContent>
					<FormProvider methods={methods}>
						<RHFSelect
							name="Character"
							LabelOption={"label"}
							keyValue={"value"}
							defaultValue={watch("character_name").toString()}
							options={account.players.map((c) => ({
								label: c.name,
								value: c.name,
							}))}
							onValueChange={(v) => {
								console.log(v);
								setValue("character_name", v);
							}}
						/>
					</FormProvider>
				</CustomCardContent>
			</CustomCard>

			{selectedPlayer?.player_battlepass_tasks && (
				<CustomCard>
					<CustomCardHeader>
						Remaining Tasks
						<div className="flex flex-row items-center gap-2">
							<span className="font-bold text-accent">
								{selectedPlayer?.name}
							</span>
						</div>
					</CustomCardHeader>
					<CustomCardContent className="w-full">
						<BattlepassTaskList />
					</CustomCardContent>
				</CustomCard>
			)}
			{selectedPlayer?.player_battlepass_progress && (
				<CustomCard>
					<CustomCardHeader>Battlepass tracker</CustomCardHeader>
					<CustomCardContent>
						<BattlepassTracker />
					</CustomCardContent>
				</CustomCard>
			)}
		</>
	);
}

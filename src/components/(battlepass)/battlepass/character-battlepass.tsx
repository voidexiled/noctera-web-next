"use client";

import { API_ROUTES } from "@/app/api/routes";
import type { BattlepassCharacterPOSTRequest, BattlepassCharacterPOSTResponse } from "@/app/api/types";
import { BattlepassContext, type BattlepassContextType } from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { CustomCard, CustomCardContent, CustomCardHeader } from "@/components/(battlepass)/battlepass/custom-card";
import { getDisplayRankTextClassname, playerIsRank } from "@/components/(battlepass)/battlepass/lib/utils";
import { BattlepassTaskList } from "@/components/(battlepass)/battlepass/task/task-list";
import { BattlepassTracker } from "@/components/(battlepass)/battlepass/tracker/battlepass-tracker";
import { FormProvider, RHFSelect } from "@/components/common/hook-form";
import SparklesText from "@/components/ui/sparkles-text";
import { useBattlepass } from "@/hooks/useBattlepass";
import { cn } from "@/lib/utils";
import { typedFetch } from "@/utils/typedFetch";

import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CharacterBattlepass() {
	const { account, currentSeason, selectedPlayer, setSelectedPlayer, setAccount, setCurrentSeason, refetchSeason, refetchAccount } = useBattlepass();

	// setAccount(acc);
	// setCurrentSeason(cs);
	// setSelectedPlayer(acc.players[0] ?? null);

	const BattlepassFormSchema = z.object({
		character_name: z.string(),
	});

	type battlepassFormValues = z.infer<typeof BattlepassFormSchema>;

	const methods = useForm<battlepassFormValues>({
		defaultValues: {
			character_name: account.players ? (account.players.length > 0 ? account.players[0].name : "") : "",
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
			const _findedCharacter = account.players.find((c) => c.name === values.character_name);
			if (!_findedCharacter) return;

			try {
				// console.log("id: ", _findedCharacter.id, typeof _findedCharacter.id);
				// console.log("season_id: ", currentSeason.id, typeof currentSeason.id);

				const _updatedCharacter = await typedFetch<BattlepassCharacterPOSTRequest, BattlepassCharacterPOSTResponse>(API_ROUTES.battlepass.character._, {
					method: "POST",
					body: {
						id: _findedCharacter.id,
						season_id: currentSeason.id,
					},
				});

				if (_updatedCharacter) {
					refetchSeason();
					setSelectedPlayer(_updatedCharacter.player);
				}
				console.log("_updatedCharacter", _updatedCharacter);
			} catch (e) {
				const error: Error = e as Error;
				console.error(error);
			}
		};
		findCharacter();
		console.log("name is changed to ", values.character_name);
	}, [values.character_name]);

	if (!account || !account.players || !account.players.length || !currentSeason) return <></>;

	return (
		<>
			<CustomCard>
				<CustomCardHeader>
					<span className="font-bold">{currentSeason.season_name}</span>

					{!playerIsRank(selectedPlayer, "FREE") ? (
						<SparklesText
							className={cn("font-sans text-base", getDisplayRankTextClassname(selectedPlayer?.battlepass_rank))}
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
					<span className="text-card-foreground/90 text-sm">{currentSeason.description}</span>
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
							<span className="font-bold text-accent">{selectedPlayer?.name}</span>
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

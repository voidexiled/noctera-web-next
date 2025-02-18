"use client";
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
import { set } from "lodash";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export type BattlepassContextType = {
	battlepassRequiredExperienceForLevelUp: number;
	battlepassMaxLevel: number;
	playerCurrentBattlepassLevel: number;

	setBattlepassMaxLevel: (maxLevel: number) => void;
	setPlayerCurrentBattlepassLevel: (currentLevel: number) => void;
	setBattlepassRequiredExperienceForLevelUp: (experience: number) => void;

	currentSeason: battlepass_seasons & {
		battlepass_seasons_rewards: battlepass_seasons_rewards[];
		battlepass_seasons_tasks: battlepass_seasons_tasks[];
	};

	account: accounts & {
		players: (players & {
			player_battlepass_progress: player_battlepass_progress[];
			player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
			player_battlepass_tasks: player_battlepass_tasks[];
		})[];
	};

	selectedPlayer: players & {
		player_battlepass_progress: player_battlepass_progress[];
		player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
		player_battlepass_tasks: player_battlepass_tasks[];
	};

	setCurrentSeason: (
		season: battlepass_seasons & {
			battlepass_seasons_rewards: battlepass_seasons_rewards[];
			battlepass_seasons_tasks: battlepass_seasons_tasks[];
		},
	) => void;

	setAccount: (
		account: accounts & {
			players: (players & {
				player_battlepass_progress: player_battlepass_progress[];
				player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
				player_battlepass_tasks: player_battlepass_tasks[];
			})[];
		},
	) => void;

	setSelectedPlayer: (
		player: players & {
			player_battlepass_progress: player_battlepass_progress[];
			player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
			player_battlepass_tasks: player_battlepass_tasks[];
		},
	) => void;

	refetchSeason: () => Promise<void>;
	refetchAccount: () => Promise<void>;
};

export const BattlepassContext = createContext<BattlepassContextType | undefined>(undefined);

export const BattlepassProvider: React.FC<{
	children: React.ReactNode;
	acc: accounts & {
		players: (players & {
			player_battlepass_progress: player_battlepass_progress[];
			player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
			player_battlepass_tasks: player_battlepass_tasks[];
		})[];
	};
	cs: battlepass_seasons & {
		battlepass_seasons_rewards: battlepass_seasons_rewards[];
		battlepass_seasons_tasks: battlepass_seasons_tasks[];
	};
}> = ({ children, acc, cs }) => {
	const router = useRouter();

	const [currentSeason, setCurrentSeason] = useState<
		battlepass_seasons & {
			battlepass_seasons_rewards: battlepass_seasons_rewards[];
			battlepass_seasons_tasks: battlepass_seasons_tasks[];
		}
	>(cs);

	const [account, setAccount] = useState<
		accounts & {
			players: (players & {
				player_battlepass_progress: player_battlepass_progress[];
				player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
				player_battlepass_tasks: player_battlepass_tasks[];
			})[];
		}
	>(acc);

	const [selectedPlayer, setSelectedPlayer] = useState<
		players & {
			player_battlepass_progress: player_battlepass_progress[];
			player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
			player_battlepass_tasks: player_battlepass_tasks[];
		}
	>(account?.players?.[0] ?? null);

	const [battlepassMaxLevel, setBattlepassMaxLevel] = useState<number>(50);
	const [playerCurrentBattlepassLevel, setPlayerCurrentBattlepassLevel] = useState<number>(1);

	const [battlepassRequiredExperienceForLevelUp, setBattlepassRequiredExperienceForLevelUp] =
		useState<number>(100);

	async function refetchSeason() {
		try {
			const _season: {
				season: battlepass_seasons & {
					battlepass_seasons_tasks: battlepass_seasons_tasks[];
					battlepass_seasons_rewards: battlepass_seasons_rewards[];
				};
			} = await fetch("/api/battlepass/season/current", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => {
					console.log(err);
					return { season: null };
				});
			console.log("_season", _season);
			setCurrentSeason(_season.season);
		} catch (error) {
			console.log(error);
		}
	}

	async function refetchAccount() {
		try {
			const _account: {
				account: accounts & {
					players: (players & {
						player_battlepass_progress: player_battlepass_progress[];
						player_battlepass_rewards_claimed: player_battlepass_rewards_claimed[];
						player_battlepass_tasks: player_battlepass_tasks[];
					})[];
				};
			} = await fetch("/api/battlepass/account", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: selectedPlayer.id,
					season_id: currentSeason.id,
				}),
			})
				.then((res) => res.json())
				.catch((err) => {
					console.log(err);
					return { account: null };
				});
			console.log("_account", _account);
			setAccount(_account.account);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const updateInfo = async () => {
			if (selectedPlayer?.player_battlepass_progress[0]?.current_exp) {
				// todo: get max level from season

				setBattlepassMaxLevel(50);
				setPlayerCurrentBattlepassLevel(
					Math.floor(
						selectedPlayer.player_battlepass_progress[0].current_exp /
							battlepassRequiredExperienceForLevelUp,
					),
				);
				refetchSeason();
			}
		};

		updateInfo();
	}, [selectedPlayer?.id]);

	return (
		<BattlepassContext.Provider
			value={{
				currentSeason,
				account,
				selectedPlayer,
				setCurrentSeason,
				setAccount,
				setSelectedPlayer,
				battlepassMaxLevel,
				setBattlepassMaxLevel,
				playerCurrentBattlepassLevel,
				setPlayerCurrentBattlepassLevel,
				battlepassRequiredExperienceForLevelUp,
				setBattlepassRequiredExperienceForLevelUp,
				refetchSeason,
				refetchAccount,
			}}
		>
			{account?.players?.length && currentSeason ? <>{children}</> : <></>}
		</BattlepassContext.Provider>
	);
};

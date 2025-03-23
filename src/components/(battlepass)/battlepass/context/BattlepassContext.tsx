"use client";
import { API_ROUTES } from "@/app/api/routes";
import type {
	BattlepassAccountPOSTRequest,
	BattlepassAccountPOSTResponse,
	BattlepassSeasonCurrentPOSTRequest,
	BattlepassSeasonCurrentPOSTResponse,
} from "@/app/api/types";
import { typedFetch } from "@/utils/typedFetch";
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

	const [battlepassRequiredExperienceForLevelUp, setBattlepassRequiredExperienceForLevelUp] = useState<number>(100);

	async function refetchSeason() {
		try {
			const _season = await typedFetch<BattlepassSeasonCurrentPOSTRequest, BattlepassSeasonCurrentPOSTResponse>(API_ROUTES.battlepass.season.current._, {
				method: "POST",
			});
			console.log("_season", _season);
			setCurrentSeason(_season.season);
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	async function refetchAccount() {
		try {
			const _account = await typedFetch<BattlepassAccountPOSTRequest, BattlepassAccountPOSTResponse>(API_ROUTES.battlepass.account._, {
				method: "POST",
				body: {
					id: selectedPlayer.id,
					season_id: currentSeason.id,
				},
			});
			console.log("_account", _account);
			setAccount(_account.account);
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	useEffect(() => {
		const updateInfo = async () => {
			if (selectedPlayer?.player_battlepass_progress[0]?.current_exp) {
				// todo: get max level from season
				setBattlepassMaxLevel(50);
				setPlayerCurrentBattlepassLevel(Math.floor(selectedPlayer.player_battlepass_progress[0].current_exp / battlepassRequiredExperienceForLevelUp));
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

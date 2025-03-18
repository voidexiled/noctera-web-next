"use client";
import { isDateActive } from "@/components/(battlepass)/battlepass/lib/utils";
import { prisma } from "@/lib/prisma";
import type {
	battlepass_seasons,
	battlepass_seasons_rewards,
	battlepass_seasons_tasks,
} from "@prisma/client";
import dayjs from "dayjs";
import { createContext, useState } from "react";

type AdminBattlepassPaths = "seasons" | "rewards" | "tasks";

export type AdminBattlepassContextType = {
	currentPath: AdminBattlepassPaths;
	setCurrentPath: (path: AdminBattlepassPaths) => void;
	seasons: battlepass_seasons[];
	rewards: battlepass_seasons_rewards[];
	tasks: battlepass_seasons_tasks[];
	refetchSeasons: () => Promise<void>;
	mostUsedSeasonId: number | null;
	setMostUsedSeasonId: (id: number | null) => void;
};

export const AdminBattlepassContext = createContext<AdminBattlepassContextType | undefined>(
	undefined,
);

export const AdminBattlepassProvider: React.FC<{
	children: React.ReactNode;
	battlepassSeasons: battlepass_seasons[];
	battlepassRewards: battlepass_seasons_rewards[];
	battlepassTasks: battlepass_seasons_tasks[];
}> = ({ children, battlepassSeasons, battlepassRewards, battlepassTasks }) => {
	const [currentPath, setCurrentPath] =
		useState<AdminBattlepassContextType["currentPath"]>("seasons");
	const [seasons, setSeasons] = useState<battlepass_seasons[]>(battlepassSeasons);
	const [rewards, setRewards] = useState<battlepass_seasons_rewards[]>(battlepassRewards);
	const [tasks, setTasks] = useState<battlepass_seasons_tasks[]>(battlepassTasks);

	const [mostUsedSeasonId, setMostUsedSeasonId] = useState<number | null>(
		seasons
			? seasons.filter((s) => {
					if (typeof s.date_start !== typeof new Date() || typeof s.date_end !== typeof new Date())
						return false;
					if (s.date_start && s.date_end) {
						return isDateActive(
							dayjs().unix(),
							s.date_start.toISOString(),
							s.date_end.toISOString(),
						);
					}
				})[0]?.id
			: null,
	);

	async function refetchSeasons() {
		try {
			const _seasons: {
				seasons: battlepass_seasons[];
			} = await fetch("/api/battlepass/seasons", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					rewards: false,
					tasks: false,
				}),
			}).then((res) => res.json());

			setSeasons(_seasons.seasons);
			fetchRewards();
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
			throw error;
		}
	}

	async function fetchRewards() {
		try {
			const _rewards: {
				rewards: battlepass_seasons_rewards[];
			} = await fetch("/api/battlepass/rewards", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());
			setRewards(_rewards.rewards);
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
			throw error;
		}
	}

	async function fetchTasks(): Promise<void> {
		return Promise.resolve();
	}

	return (
		<AdminBattlepassContext.Provider
			value={{
				currentPath,
				setCurrentPath,
				seasons,
				rewards,
				tasks,
				refetchSeasons,
				mostUsedSeasonId,
				setMostUsedSeasonId,
			}}
		>
			{children}
		</AdminBattlepassContext.Provider>
	);
};

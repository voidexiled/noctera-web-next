"use client";
import type { battlepass_seasons, battlepass_seasons_rewards, battlepass_seasons_tasks } from "@prisma/client";
import { createContext, useState } from "react";

type AdminBattlepassPaths = "seasons" | "rewards" | "tasks";

export type AdminBattlepassContextType = {
    currentPath: AdminBattlepassPaths;
    setCurrentPath: (path: AdminBattlepassPaths) => void;
    seasons: battlepass_seasons[];
    rewards: battlepass_seasons_rewards[];
    tasks: battlepass_seasons_tasks[];
    refetchSeasons: () => Promise<void>;
};

export const AdminBattlepassContext = createContext<AdminBattlepassContextType | undefined>(undefined);


export const AdminBattlepassProvider: React.FC<{ children: React.ReactNode, battlepassSeasons: battlepass_seasons[], battlepassRewards: battlepass_seasons_rewards[], battlepassTasks: battlepass_seasons_tasks[] }> = ({ children, battlepassSeasons, battlepassRewards, battlepassTasks }) => {
    const [currentPath, setCurrentPath] = useState<AdminBattlepassContextType["currentPath"]>("seasons");
    const [seasons, setSeasons] = useState<battlepass_seasons[]>(battlepassSeasons);
    const [rewards, setRewards] = useState<battlepass_seasons_rewards[]>(battlepassRewards);
    const [tasks, setTasks] = useState<battlepass_seasons_tasks[]>(battlepassTasks);

    async function refetchSeasons() {
        try {
            const seasons = await fetch("/api/battlepass/seasons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rewards: true,
                    tasks: true,
                }),
            }).then((res) => res.json());
            setSeasons(seasons.seasons);
        } catch (error) {
            console.log(error);
        }
    }

    function fetchRewards(): Promise<void> {
        return Promise.resolve();
    }

     async function fetchTasks(): Promise<void> {
        return Promise.resolve();
    }

    return (
        <AdminBattlepassContext.Provider value={{ currentPath, setCurrentPath, seasons, rewards, tasks, refetchSeasons }}>
            {children}
        </AdminBattlepassContext.Provider>
    );
};
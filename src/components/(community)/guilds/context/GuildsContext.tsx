"use client";

import type { GuildsTableType } from "@/components/(community)/guilds/types/guilds";
import type React from "react";
import { createContext, useContext, useState } from "react";

type GuildsContextType = {
	guilds: GuildsTableType[];
	setGuilds: React.Dispatch<React.SetStateAction<GuildsTableType[]>>;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export const GuildsContext = createContext<GuildsContextType | undefined>(undefined);

export const GuildsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [guilds, setGuilds] = useState<GuildsTableType[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<GuildsContext.Provider value={{ guilds, setGuilds, searchTerm, setSearchTerm }}>
			{children}
		</GuildsContext.Provider>
	);
};

export const useGuildsContext = () => {
	const context = useContext(GuildsContext);
	if (context === undefined) {
		throw new Error("useGuilds must be used within a GuildsProvider");
	}
	return context;
};

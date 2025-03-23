import { useGuildsContext } from "@/components/(community)/guilds/context/GuildsContext";
import { CreateGuildDialog } from "@/components/(community)/guilds/guilds-table/CreateGuildDialog";
import type { GuildsTableType } from "@/components/(community)/guilds/types/guilds";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { guilds, players } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type GuildsTableHeaderProps = {
	players: players[];
	totalPages: number;
};

export const GuildsHeader = ({ players, totalPages }: GuildsTableHeaderProps) => {
	const { status } = useSession();
	const { setGuilds, searchTerm, setSearchTerm } = useGuildsContext();
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(async () => {
			let url: string;
			if (searchTerm.length > 0) {
				url = `/api/guilds/${encodeURI(searchTerm)}`;
			} else {
				url = "/api/guilds";
			}
			try {
				const response = await fetch(url);
				if (response.ok) {
					const data: GuildsTableType[] = await response.json();
					setGuilds(data);
				}
			} catch (e) {
				const error: Error = e as Error;
				console.error("Error:", error);
			}
		}, 500);
	}, [searchTerm]);

	const canCreateGuild = status === "authenticated" && players.length > 0;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-3">
				<Input
					id="search"
					type="text"
					placeholder="Search Guilds..."
					onChange={(e) => setSearchTerm(e.target.value)}
					value={searchTerm}
					autoFocus
				/>

				{canCreateGuild && (
					<Dialog>
						<DialogTrigger asChild>
							<Button className="h-9 whitespace-nowrap">Found Guild</Button>
						</DialogTrigger>

						<CreateGuildDialog
							players={players.map((p) => ({
								value: `${p.id}`,
								label: `${p.name}`,
							}))}
						/>
					</Dialog>
				)}
			</div>
			<div className="flex justify-end">
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
};

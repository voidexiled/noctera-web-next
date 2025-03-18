"use client";

import { API_ROUTES } from "@/app/api/routes";
import type { GuildsCharactersNameGETRequest, GuildsCharactersNameGETResponse } from "@/app/api/types";
import type { Character } from "@/components/(community)/characters/types/characters";
import type { InvitePlayerToGuildErrorResponse, InvitePlayerToGuildResponse } from "@/components/(community)/guilds/types/guilds";
import { IconiFy } from "@/components/common/Iconify";
import TableEmptyState from "@/components/common/TableEmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { typedFetch } from "@/utils/typedFetch";

import { PlusCircle, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type InvitePlayerProps = {
	guild_id: number;
};

export const InvitePlayerButton = ({ guild_id }: InvitePlayerProps) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [characters, setCharacters] = useState<Character[]>([]);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (searchTerm === "") return;
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(async () => {
			try {
				const response = await typedFetch<GuildsCharactersNameGETRequest, GuildsCharactersNameGETResponse>(
					API_ROUTES.guilds.characters.name(searchTerm),
					{
						method: "GET",
					},
				);
				if (response.status === 200) {
					setCharacters(response.characters);
				}
			} catch (e) {
				const error: Error = e as Error;
				console.error(error);
			}
		}, 500);
	}, [searchTerm]);

	async function invitePlayer(player_id: number) {
		const res = await fetch(`/api/guilds/manager/${guild_id}/player/${player_id}`, {
			method: "POST",
		});

		if (res.ok) {
			const dataResponse: InvitePlayerToGuildResponse = await res.json();
			toast.success(`Invitation to join the guild sent to ${dataResponse.player_name}`);
			router.refresh();
			return;
		}
		if (res.status === 400) {
			const data: InvitePlayerToGuildErrorResponse = await res.json();
			if (data.message) toast.error(data.message);
		}
		if (res.status === 500) {
			toast.error(`A error ocurred while sending invitation to ${player_id}`);
		}
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="green" className="gap-2" size="xs">
					<PlusCircle className="h-4 w-4" />
					<span>Invite Player</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" align="end">
				<div className="p-2">
					<Input
						id="search"
						type="text"
						placeholder="Search Character..."
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
						autoFocus
						className="mb-2 h-8"
					/>

					{characters.length ? (
						<ScrollArea className="max-h-60">
							<div className="flex flex-col gap-1">
								{characters.map((character) => {
									return (
										<div
											className="flex flex-row items-center justify-between rounded-md bg-card/30 py-1 pr-1.5 pl-3 transition-colors delay-0 duration-150 hover:bg-card/60"
											key={character.id}
										>
											<span className="text-popover-foreground/90 text-sm">{character.name}</span>
											<Button variant="ghost" size="iconsm" onClick={() => invitePlayer(character.id)}>
												<SendIcon className="h-4 w-4" />
											</Button>
										</div>
									);
								})}
							</div>
						</ScrollArea>
					) : (
						<TableEmptyState />
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};

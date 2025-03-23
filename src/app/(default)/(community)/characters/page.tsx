"use client";
import { API_ROUTES } from "@/app/api/routes";
import type { CharactersByNameGETResponse } from "@/app/api/types";
import { CharactersTable } from "@/components/(community)/characters/CharactersTableNew";
import type { Character } from "@/components/(community)/characters/types/characters";
import TableEmptyState from "@/components/common/TableEmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { typedFetch } from "@/utils/typedFetch";
import type { players } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function CharactersPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [characters, setCharacters] = useState<Array<Character>>([]);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (searchTerm === "") return;
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(async () => {
			const response = await typedFetch<undefined, CharactersByNameGETResponse>(
				API_ROUTES.characters.name(searchTerm),
			);

			if (!response.error) {
				setCharacters(response.characters);
			} else {
				console.error(response.error);
			}
		}, 350);
	}, [searchTerm]);

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Characters</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 ">
				<CharactersTable
					characters={characters.filter((character) => character.hidden === false)}
					searchTerms={searchTerm}
					setSearchTermsAction={setSearchTerm}
				/>
			</CardContent>
		</Card>
	);
}

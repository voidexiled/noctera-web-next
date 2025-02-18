"use client";
import { CharactersTable } from "@/components/(community)/characters/CharactersTableNew";
import type { Character } from "@/components/(community)/characters/types/characters";
import TableEmptyState from "@/components/common/TableEmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
			try {
				const response = await fetch(`/api/characters/${searchTerm}`);
				if (response.ok) {
					const data: Character[] = await response.json();
					setCharacters(data);
				}
			} catch (error) {
				console.log("Error:", error);
			}
		}, 350);
	}, [searchTerm]);

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Characters</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<CharactersTable
					characters={characters}
					searchTerms={searchTerm}
					setSearchTermsAction={setSearchTerm}
				/>
			</CardContent>
		</Card>
	);
}

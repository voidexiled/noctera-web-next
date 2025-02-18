import type { HighscoresCategory } from "@/components/(community)/highscores/types/highscores";
import { prisma } from "@/lib/prisma";
import type { players } from "@prisma/client";

const ITEMS_PER_PAGE = 25;

function getVocationIds(value: string): number[] {
	const vocationMap: Record<string, number[]> = {
		"0": [0, 1, 2, 3, 4, 5, 6, 7, 8],
		"1": [1, 5],
		"2": [2, 6],
		"3": [3, 7],
		"4": [4, 8],
	};
	return vocationMap[value] || [];
}

type FetchCharactersParams = {
	vocation: string;
	currentPage: number;
	category: HighscoresCategory;
};

export async function fetchCharacters({ currentPage, vocation, category }: FetchCharactersParams) {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;
	const vocationIds = getVocationIds(vocation);

	try {
		const playersFilter = {
			where: {
				AND: [
					vocation ? { vocation: { in: vocationIds } } : {},
					{ id: { not: { in: [1, 2, 3, 4, 5] } } },
					{ group_id: { not: { in: [4, 5, 6] } } },
				],
			},
		};

		const count = await prisma.players.count(playersFilter);

		const players: players[] = await prisma.players.findMany({
			...playersFilter,
			orderBy: { [category]: "desc" },
			take: ITEMS_PER_PAGE,
			skip: offset,
		});

		return {
			players,
			totalPage: Math.ceil(count / ITEMS_PER_PAGE),
		};
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch character data.");
	}
}

export async function fetchPlayersTopFive() {
	try {
		const players: players[] = await prisma.players.findMany({
			where: {
				id: { not: { in: [1, 2, 3, 4, 5] } },
				group_id: { not: { in: [4, 5, 6] } },
				vocation: { not: { in: [0] } },
			},
			orderBy: { level: "desc" },
			take: 5,
		});

		return players;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch character data.");
	}
}

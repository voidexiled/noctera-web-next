import { fetchCharacters } from "@/actions/general/highscores/actions";
import { HighscoresFilters } from "@/components/(community)/highscores/filters/HighscoresFilters";
import { HighscoresTable } from "@/components/(community)/highscores/highscores-table/HighscoresTable";
import type {
	HighscoresCategory,
	HighscoresVocation,
} from "@/components/(community)/highscores/types/highscores";
import OutfitComponent from "@/components/animations/OutfitComponent";
import TableEmptyState from "@/components/common/TableEmptyState";
import Pagination from "@/components/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { getVocation } from "@/utils/functions/getVocations";
import Link from "next/link";

export default async function HighScores(props: {
	searchParams?: Promise<{
		vocation?: HighscoresVocation;
		page?: string;
		category: HighscoresCategory;
	}>;
}) {
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams?.page) || 1;
	const vocation = searchParams?.vocation || "0";
	const category = searchParams?.category || "experience";

	const { players, totalPage } = await fetchCharacters({
		currentPage,
		vocation,
		category,
	});

	const itemsPerPage = 25;
	const startIndex = (currentPage - 1) * itemsPerPage;

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Highscores</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<HighscoresFilters />

				<div className="flex flex-col rounded-sm border">
					<div className="flex items-center justify-between bg-background p-2 text-sm">
						HighScores
						<Pagination totalPages={totalPage} />
					</div>
					<HighscoresTable players={players} category={category} startIndex={startIndex} />
				</div>
			</CardContent>
		</Card>
	);
}

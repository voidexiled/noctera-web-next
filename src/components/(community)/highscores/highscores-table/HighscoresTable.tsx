// ! TODO: Delete this file
import { PlayerRow } from "@/components/(community)/highscores/highscores-table/PlayerRow";
import type {
	HighscoresCategory,
	HighscoresVocation,
} from "@/components/(community)/highscores/types/highscores";
import OutfitComponent from "@/components/animations/OutfitComponent";
import TableEmptyState from "@/components/common/TableEmptyState";
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
import type { players } from "@prisma/client";
import Link from "next/link";

const columnName = {
	skill_axe: "Axe Fighting",
	skill_club: "Club Fighting",
	skill_dist: "Distance Fighting",
	experience: "Exp",
	skill_fishing: "Fishing",
	skill_fist: "Fist Fighting",
	maglevel: "Magic Level",
	skill_shielding: "Shielding",
	skill_sword: "Sword Fighting",
};

type HighscoresTableProps = {
	players: players[];
	category: HighscoresCategory;
	startIndex: number;
};

export const HighscoresTable = ({ players, category, startIndex }: HighscoresTableProps) => {
	return (
		<Table>
			<TableHeader className="pointer-events-none">
				<TableRow>
					<TableHead className="w-[30px]">Rank</TableHead>
					<TableHead className="w-[60px]">Outfit</TableHead>
					<TableHead className="w-full">Name</TableHead>
					<TableHead className="w-[150px] whitespace-nowrap">Vocation</TableHead>
					<TableHead className="w-[20px] whitespace-nowrap">Level</TableHead>
					<TableHead className="whitespace-nowrap text-right">{columnName[category]}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{players.map((character, index) => {
					return (
						<PlayerRow
							key={character.id}
							character={character}
							rank={startIndex + index + 1}
							category={category}
						/>
					);
				})}

				{players.length === 0 && (
					<TableRow>
						<TableCell colSpan={6}>
							<TableEmptyState />
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

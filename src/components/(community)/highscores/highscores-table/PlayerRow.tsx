// ! TODO: Delete this file
import type { HighscoresCategory } from "@/components/(community)/highscores/types/highscores";
import OutfitComponent from "@/components/animations/OutfitComponent";
import { TableCell, TableRow } from "@/components/ui/table";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { getVocation } from "@/utils/functions/getVocations";
import type { players } from "@prisma/client";
import Link from "next/link";

type PlayerRowProps = {
	character: players;
	rank: number;
	category: HighscoresCategory;
};

export const PlayerRow = ({ character, rank, category }: PlayerRowProps) => {
	return (
		<TableRow key={character.id}>
			<TableCell className="w-[30px] text-center">{rank}</TableCell>
			<TableCell>
				<OutfitComponent className="-left-4 -top-3" outfit={character} alt={character.name} />
			</TableCell>
			<TableCell className="">
				<Link href={`/characters/${character.name}`} className="text-blue-500 hover:underline">
					{character.name}
				</Link>
			</TableCell>
			<TableCell className="w-[100px] whitespace-nowrap">
				{getVocation(character.vocation)}
			</TableCell>
			<TableCell className="w-[20px]">{character.level}</TableCell>
			<TableCell className="whitespace-nowrap text-right">
				{convertBigIntsToNumbers(character[category])}
			</TableCell>
		</TableRow>
	);
};

import OutfitComponent from "@/components/animations/OutfitComponent";
import { TableCell, TableRow } from "@/components/ui/table";
import { getVocation } from "@/utils/functions/getVocations";
import type { players } from "@prisma/client";
import Link from "next/link";

export const PlayerRow = ({ character }: { character: players }) => {
	const { name, level, vocation } = character;
	const vocationName = getVocation(vocation);
	return (
		<TableRow>
			<TableCell>
				<OutfitComponent outfit={character} alt={character.name} />
			</TableCell>
			<TableCell>
				<Link href={`/characters/${name}`} className="text-blue-500 hover:underline">
					{name}
				</Link>
			</TableCell>
			<TableCell className="whitespace-nowrap">{vocationName}</TableCell>
			<TableCell>{level}</TableCell>
		</TableRow>
	);
};

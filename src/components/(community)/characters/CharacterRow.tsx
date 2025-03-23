import type { Character } from "@/components/(community)/characters/types/characters";
import OutfitComponent from "@/components/animations/OutfitComponent";
import { TableCell, TableRow } from "@/components/ui/table";
import { getVocation } from "@/utils/functions/getVocations";
import { useRouter } from "next/navigation";

export const CharacterRow = ({ character }: { character: Character }) => {
	const router = useRouter();
	return (
		<TableRow
			key={character.id.toString()}
			onClick={() => router.push(`/characters/${character.name}`)}
			className="cursor-pointer"
		>
			<TableCell>
				<OutfitComponent outfit={character} alt={character.name} />
			</TableCell>
			<TableCell>{character.name}</TableCell>
			<TableCell className="whitespace-nowrap">{getVocation(character.vocation)}</TableCell>
			<TableCell className="text-right">{character.level}</TableCell>
		</TableRow>
	);
};

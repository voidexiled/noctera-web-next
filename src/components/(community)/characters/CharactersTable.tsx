import { CharacterRow } from "@/components/(community)/characters/CharacterRow";
import type { Character } from "@/components/(community)/characters/types/characters";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const CharactersTable = ({ characters }: { characters: Character[] }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[60px]">Outfit</TableHead>
					<TableHead className="">Name</TableHead>
					<TableHead className="w-[100px]">Vocation</TableHead>
					<TableHead className="w-[20px]">Level</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{characters.map((player) => {
					return <CharacterRow key={player.id.toString()} character={player} />;
				})}
			</TableBody>
		</Table>
	);
};

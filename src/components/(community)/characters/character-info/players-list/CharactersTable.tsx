import { CharacterRow } from "@/components/(community)/characters/character-info/players-list/CharacterRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

async function isOnline(player_id: number) {
	const query = await prisma.players_online.findFirst({ where: { player_id } });
	if (query) {
		return true;
	}
	return false;
}

type CharactersTableProps = {
	characters: Array<{
		id: number;
		name: string;
	}>;
};

export const CharactersTable = ({ characters }: CharactersTableProps) => (
	<div className="flex flex-col rounded-sm border">
		<div className="flex items-start justify-start bg-background p-2 text-sm">Characters</div>
		<Table>
			<TableHeader className="pointer-events-none">
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{characters.map(async (character) => {
					const isPlayerOnline = await isOnline(character.id);
					return (
						<CharacterRow key={character.id} character={character} isOnline={isPlayerOnline} />
					);
				})}
			</TableBody>
		</Table>
	</div>
);

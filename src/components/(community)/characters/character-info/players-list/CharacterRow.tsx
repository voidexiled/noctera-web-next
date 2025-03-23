import { OnlineStatusBadge } from "@/components/(community)/characters/character-info/players-list/OnlineStatusBadge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

type CharacterRowProps = {
	character: {
		id: number;
		name: string;
	};
	isOnline: boolean | null;
};

export const CharacterRow = ({ character, isOnline }: CharacterRowProps) => {
	return (
		<TableRow>
			<TableCell className="w-full">{character.name}</TableCell>
			<TableCell>
				<OnlineStatusBadge isOnline={isOnline} />
			</TableCell>
			<TableCell className="text-right">
				<Button variant="outline" size="xs" asChild>
					<Link href={`/characters/${character.name}`}>View</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
};

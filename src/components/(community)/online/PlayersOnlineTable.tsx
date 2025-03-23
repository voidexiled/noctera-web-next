import { PlayerRow } from "@/components/(community)/online/PlayerRow";
import TableEmptyState from "@/components/common/TableEmptyState";
import Pagination from "@/components/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getVocation } from "@/utils/functions/getVocations";
import type { players } from "@prisma/client";
import Link from "next/link";

type PlayersOnlineTableProps = {
	players: players[];
	totalPage: number;
};

export const PlayersOnlineTable = ({ players, totalPage }: PlayersOnlineTableProps) => {
	return (
		<div className="flex flex-col rounded-sm border">
			<div className="flex items-center justify-between bg-background p-2 text-sm">
				<div />
				<Pagination totalPages={totalPage} />
			</div>
			{players.length > 0 ? (
				<Table>
					<TableHeader className="pointer-events-none">
						<TableRow>
							<TableHead className="w-[60px]">Outfit</TableHead>
							<TableHead className="w-full">Name</TableHead>
							<TableHead className="w-[100px]">Vocation</TableHead>
							<TableHead className="w-[20px]">Level</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players.map((character) => {
							return <PlayerRow key={character.id} character={character} />;
						})}
					</TableBody>
				</Table>
			) : (
				<TableEmptyState />
			)}
		</div>
	);
};

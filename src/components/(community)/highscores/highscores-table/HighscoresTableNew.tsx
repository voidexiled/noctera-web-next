import { CreateGuildDialog } from "@/components/(community)/guilds/guilds-table/CreateGuildDialog";
import { PlayerRow } from "@/components/(community)/highscores/highscores-table/PlayerRow";
import type {
	HighscoresCategory,
	HighscoresVocation,
} from "@/components/(community)/highscores/types/highscores";
import OutfitComponent from "@/components/animations/OutfitComponent";
import TableEmptyState from "@/components/common/TableEmptyState";
import { createColumns } from "@/components/common/data-table/columns";
import { DataTable } from "@/components/common/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const skillsOptions = [
	{ value: "skill_axe", label: "Axe Fighting" },
	{ value: "skill_club", label: "Club Fighting" },
	{ value: "skill_dist", label: "Distance Fighting" },
	{ value: "experience", label: "Exp" },
	{ value: "skill_fishing", label: "Fishing" },
	{ value: "skill_fist", label: "Fist Fighting" },
	{ value: "maglevel", label: "Magic Level" },
	{ value: "skill_shielding", label: "Shielding" },
	{ value: "skill_sword", label: "Sword Fighting" },
];

type HighscorePlayer = {
	name: string;
	vocation: number;
	level: number;
	experience: number;
	maglevel: number;
	skill_axe: number;
	skill_club: number;
	skill_dist: number;
	skill_fishing: number;
	skill_fist: number;
	skill_shielding: number;
	skill_sword: number;
	looktype: number;
	lookbody: number;
	lookfeet: number;
	looklegs: number;
	lookhead: number;
};

const vocationOptions = [
	{ value: "0", label: "All" },
	{ value: "1", label: "Sorcerer" },
	{ value: "2", label: "Druid" },
	{ value: "3", label: "Paladin" },
	{ value: "4", label: "Knight" },
];

const columnConfig = createColumns<HighscorePlayer>({
	columns: [
		{
			accessorKey: "looktype",
			header: "",
			width: 64,
			cell: ({ row }) => (
				<OutfitComponent className="-left-1 -top-2 h-16 w-16" outfit={row.original} />
			),
		},
	],
});

type HighscoresTableProps = {
	players: players[];
	category: HighscoresCategory;
	startIndex: number;
	setVocationFilter: (value: string) => void;
	setSkillFilter: (value: string) => void;
	vocationFilter: string;
	skillFilter: string;
};

export const HighscoresTable = ({
	players,
	category,
	startIndex,
	vocationFilter,
	skillFilter,
	setVocationFilter,
	setSkillFilter,
}: HighscoresTableProps) => {
	const router = useRouter();
	const [rowsPerPage, setRowsPerPage] = useState("10");
	const [filteredPlayers, setFilteredPlayers] = useState<HighscorePlayer[]>([]);

	return (
		<DataTable
			columns={columnConfig}
			rowsPerPage={+rowsPerPage}
			data={filteredPlayers}
			rowClassName="h-20"
			disablePagination
			onClickBuilder={(row) => {
				router.push(`/characters/${row.name}`);
			}}
			renderToolbar={() => {
				return (
					<div className="flex items-center gap-4">
						<div className="flex flex-col gap-2">
							<Label className="text-nowrap">Filter by vocation</Label>
							<Select
								value={rowsPerPage}
								onValueChange={(value) => {
									setRowsPerPage(value);
								}}
							>
								<SelectTrigger className="w-[80px]">
									<SelectValue placeholder="Results per page" />
								</SelectTrigger>
								<SelectContent>
									{vocationOptions.map((option) => {
										return (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="text-nowrap">Filter by skill</Label>
							<Select
								value={rowsPerPage}
								onValueChange={(value) => {
									setRowsPerPage(value);
								}}
							>
								<SelectTrigger className="w-[80px]">
									<SelectValue placeholder="Results per page" />
								</SelectTrigger>
								<SelectContent>
									{skillsOptions.map((option) => {
										return (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>
				);
			}}
		/>
		// <Table>
		// 	<TableHeader className="pointer-events-none">
		// 		<TableRow>
		// 			<TableHead className="w-[30px]">Rank</TableHead>
		// 			<TableHead className="w-[60px]">Outfit</TableHead>
		// 			<TableHead className="w-full">Name</TableHead>
		// 			<TableHead className="w-[150px] whitespace-nowrap">Vocation</TableHead>
		// 			<TableHead className="w-[20px] whitespace-nowrap">Level</TableHead>
		// 			<TableHead className="whitespace-nowrap text-right">{columnName[category]}</TableHead>
		// 		</TableRow>
		// 	</TableHeader>
		// 	<TableBody>
		// 		{players.map((character, index) => {
		// 			return (
		// 				<PlayerRow
		// 					key={character.id}
		// 					character={character}
		// 					rank={startIndex + index + 1}
		// 					category={category}
		// 				/>
		// 			);
		// 		})}

		// 		{players.length === 0 && (
		// 			<TableRow>
		// 				<TableCell colSpan={6}>
		// 					<TableEmptyState />
		// 				</TableCell>
		// 			</TableRow>
		// 		)}
		// 	</TableBody>
		// </Table>
	);
};

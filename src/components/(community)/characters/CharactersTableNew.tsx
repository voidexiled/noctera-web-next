"use client";
import { CharacterRow } from "@/components/(community)/characters/CharacterRow";
import type { Character } from "@/components/(community)/characters/types/characters";
import OutfitComponent from "@/components/animations/OutfitComponent";
import { createColumns } from "@/components/common/data-table/columns";
import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { getVocation } from "@/utils/functions/getVocations";
import type { players } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const characterColumns = createColumns<Character>({
	columns: [
		{
			accessorKey: "looktype",
			header: "",
			width: 64,
			cell: ({ row }) => (
				<OutfitComponent outfit={row.original} className="-left-1 -top-2 h-16 w-16 " />
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			enableSorting: true,
			align: "left",
			width: 130,
			cell: ({ row }) => (
				<span className="text-center font-medium text-zinc-300">{row.original.name}</span>
			),
		},
		{
			accessorKey: "vocation",
			header: "Vocation",
			enableSorting: true,
			width: 60,
			align: "center",
			cell: ({ row }) => (
				<span className="font-medium text-zinc-300">{getVocation(row.original.vocation)}</span>
			),
		},
		{
			accessorKey: "level",
			header: "Level",
			enableSorting: true,
			width: 60,
			align: "center",
			cell: ({ row }) => <span className="font-medium text-zinc-300">{row.original.level}</span>,
		},
	],
});

export const CharactersTable = ({
	characters,
	searchTerms,
	setSearchTermsAction,
}: {
	characters: Character[];
	searchTerms: string;
	setSearchTermsAction: (searchTerms: string) => void;
}) => {
	const router = useRouter();
	const [characterSearch, setCharacterSearch] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState("5");
	const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);

	useEffect(() => {
		if (searchTerms === "") return setFilteredCharacters([]);
		setFilteredCharacters(
			characters.filter((character) => {
				const matchesSearch = character.name.toLowerCase().includes(characterSearch.toLowerCase());

				return matchesSearch;
			}),
		);
	}, [searchTerms, characters]);

	return (
		<DataTable
			columns={characterColumns}
			rowsPerPage={+rowsPerPage}
			data={filteredCharacters}
			onClickBuilder={(row) => {
				router.push(`/characters/${row.name}`);
			}}
			rowClassName="h-20"
			renderToolbar={() => {
				return (
					<div className="flex items-center gap-4">
						<Input
							placeholder="Search characters..."
							value={searchTerms}
							onChange={(e) => setSearchTermsAction(e.target.value)}
							className="max-w-sm"
						/>
						<div className="flex flex-row gap-3">
							<Label className="hidden items-center text-nowrap align-middle sm:inline-flex">
								Results per page
							</Label>
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
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="15">15</SelectItem>
									<SelectItem value="20">20</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* <Dialog>
						<DialogTrigger asChild>
							<Button variant="default" size="base">
								Found Guild
							</Button>
						</DialogTrigger>

						<CreateGuildDialog
							players={localAccountCharacters.map((p) => ({
								value: `${p.id}`,
								label: `${p.name}`,
							}))}
						/>
					</Dialog> */}
					</div>
				);
			}}
		/>
	);
};

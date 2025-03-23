"use client";

import { CreateGuildDialog } from "@/components/(community)/guilds/guilds-table/CreateGuildDialog";
import type { GuildsTableType } from "@/components/(community)/guilds/types/guilds";
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
import { cn } from "@/lib/utils";
import type { players } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const guildColumns = createColumns<GuildsTableType>({
	columns: [
		{
			accessorKey: "logo_name",
			header: "",
			cell: ({ row }) => (
				<div className="relative h-16 w-16">
					<Image
						src={`/api/guilds/images/${row.original.logo_name}` || "/api/guilds/images/default.gif"}
						alt={`${row.original.name} logo`}
						fill
						className="rounded-full object-cover"
					/>
				</div>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			width: 220,
			cell: ({ row }) => <span className="font-medium text-blue-300">{row.original.name}</span>,
		},
		{
			accessorKey: "members_amount",
			header: "Members",
			width: 60,
			enableSorting: true,
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="text-center font-medium text-zinc-300">
						{row.original.members_amount} members
					</span>{" "}
				</div>
			),
		},
		{
			accessorKey: "average_level",
			header: "Avg. Lvl.",
			width: 60,
			enableSorting: true,
			align: "center",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="text-center font-medium text-zinc-300">
						{Number.isNaN(row.original.average_level) ? 0 : row.original.average_level}
					</span>
				</div>
			),
		},
		{
			accessorKey: "owner_name",
			header: "Leader",
			cell: ({ row }) => (
				<div className="flex flex-col px-3">
					<span className="font-medium text-zinc-300">{row.original.owner_name}</span>
				</div>
			),
			align: "right",
		},
	],
});

type GuildsTableProps = {
	guilds: GuildsTableType[];
	localAccountCharacters: players[];
};
export const GuildsTableNew = ({ guilds, localAccountCharacters }: GuildsTableProps) => {
	const { status } = useSession();
	const router = useRouter();
	const [rowsPerPage, setRowsPerPage] = useState("5");
	const [guildSearch, setGuildSearch] = useState("");
	//const [characterClass, setCharacterClass] = useState("all");

	// Filtrar guilds basado en búsqueda y status
	const filteredGuilds = guilds.filter((guild) => {
		const matchesSearch = guild.name.toLowerCase().includes(guildSearch.toLowerCase());
		//const matchesStatus = guildStatus === "all" || guild.status === guildStatus
		//return matchesSearch && matchesStatus
		return matchesSearch;
	});

	return (
		<DataTable
			rowsPerPage={+rowsPerPage}
			rowClassName={cn("h-18")}
			columns={guildColumns}
			data={filteredGuilds}
			onClickBuilder={(row) => {
				router.push(`/guilds/${row.name}`);
			}}
			renderToolbar={() => (
				<div className="flex items-center gap-4">
					<Input
						placeholder="Search guilds..."
						value={guildSearch}
						onChange={(e) => setGuildSearch(e.target.value)}
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

					<Dialog>
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
					</Dialog>
				</div>
			)}
		/>
	);
};

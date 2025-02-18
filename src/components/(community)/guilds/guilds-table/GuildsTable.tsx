// !! TODO: THIS COMPONENT IS UNUSED, TODO DELETE IT.
"use client";
import { useGuildsContext } from "@/components/(community)/guilds/context/GuildsContext";
import { GuildRow } from "@/components/(community)/guilds/guilds-table/GuildRow";
import { GuildsHeader } from "@/components/(community)/guilds/guilds-table/GuildsHeader";
import type { GuildsTableType } from "@/components/(community)/guilds/types/guilds";

import TableEmptyState from "@/components/common/TableEmptyState";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { guilds, players } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

type GuildsTableProps = {
	localAccountCharacters: players[];
	currentPage: number;
};

export default function TableGuild({ localAccountCharacters, currentPage }: GuildsTableProps) {
	const [guildsPerPage, setGuildsPerPage] = useState<number>(10);
	const { guilds } = useGuildsContext();
	const [pagedGuilds, setPagedGuilds] = useState<GuildsTableType[]>(guilds.slice(0, guildsPerPage));

	useEffect(() => {
		let dummyCurrentPage = currentPage;
		if (currentPage > Math.ceil(guilds.length / guildsPerPage)) {
			dummyCurrentPage = Math.ceil(guilds.length / guildsPerPage);
		}
		const start = (dummyCurrentPage - 1) * guildsPerPage;
		const end = start + guildsPerPage;
		setPagedGuilds(guilds.slice(start, end));
	}, [currentPage, guilds, guildsPerPage]);

	return (
		<>
			<GuildsHeader
				players={localAccountCharacters}
				totalPages={Math.ceil(guilds.length / guildsPerPage)}
			/>

			<div className="flex flex-col rounded-sm border">
				{pagedGuilds.length > 0 ? (
					<Table>
						<TableHeader className="pointer-events-none">
							<TableRow>
								<TableHead className="w-[80px]" />
								<TableHead>Name</TableHead>
								<TableHead>Leader</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pagedGuilds.map((guild) => {
								return <GuildRow guild={guild} key={guild.id.toString()} />;
							})}
						</TableBody>
					</Table>
				) : (
					<TableEmptyState />
				)}
			</div>
		</>
	);
}

"use client";

import type { PostRow } from "@/components/(admin)/posts/types/posts";
import { LogItem } from "@/components/(news)/last-news/logs/LogItem";
import { createColumns } from "@/components/common/data-table/columns";
import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { GetAccountUnique } from "@/services/accounts/AccountsService";
import type { posts } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type PostListProps = {
	posts: PostRow[];
};

const postsColumns = createColumns<PostRow>({
	columns: [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "category",
			header: "Category",
			enableSorting: true,
		},
		{
			accessorKey: "author_name",
			header: "Created By",
			enableSorting: true,
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			enableSorting: true,
			cell: ({ row }) => {
				return <div>{dayjs(row.original.createdAt).format("D MMM YYYY HH:mm")}</div>;
			},
			align: "center",
		},
		{
			accessorKey: "content",
			header: "Content",
			cell: ({ row }) => {
				return (
					<div>
						<Dialog modal>
							<DialogTrigger asChild>
								<Button variant="secondary" size="xs">
									Preview
								</Button>
							</DialogTrigger>
							<DialogContent>
								{row.original.category === "BLOG" && (
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									<div dangerouslySetInnerHTML={{ __html: row.original.content }} />
								)}
								{row.original.category === "ROADMAP" && (
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									<div dangerouslySetInnerHTML={{ __html: row.original.content }} />
								)}
								{row.original.category === "TICKER" && (
									<LogItem log={row.original} isFirst={true} isLast={true} />
								)}
							</DialogContent>
						</Dialog>
					</div>
				);
			},
		},
	],
});

export function PostList({ posts }: PostListProps) {
	const [rowsPerPage, setRowsPerPage] = useState("5");
	const [titleSearch, setTitleSearch] = useState("");

	// Filtrar guilds basado en búsqueda y status
	const filteredPosts = posts.filter((post) => {
		const matchesSearch = post.title
			.toLowerCase()
			.normalize("NFD")
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u0300-\u036f]/g, "")
			.includes(
				titleSearch
					.toLowerCase()
					.normalize("NFD")
					// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
					.replace(/[\u0300-\u036f]/g, ""),
			);
		//const matchesStatus = guildStatus === "all" || guild.status === guildStatus
		//return matchesSearch && matchesStatus
		return matchesSearch;
	});

	return (
		<DataTable
			data={filteredPosts}
			columns={postsColumns}
			rowsPerPage={+rowsPerPage}
			renderToolbar={() => {
				return (
					<div className="flex items-center gap-4">
						<Input
							placeholder="Search by title..."
							value={titleSearch}
							onChange={(e) => setTitleSearch(e.target.value)}
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
					</div>
				);
			}}
		/>
	);
}

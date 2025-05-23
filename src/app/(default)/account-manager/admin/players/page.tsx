"use client";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { players } from "@prisma/client";
import ActionsDropdown from "./components/actions-dropdown";

type playerDataType = {
	players: players[];
	totalPages: number;
};

export default function AdminManagerPlayer() {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<playerDataType>({
		totalPages: 0,
		players: [],
	});

	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setIsLoading(true);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(async () => {
			let url: string;
			if (searchTerm.length > 0) {
				url = `/api/administration/players?page=${1}&search=${encodeURI(searchTerm)}`;
			} else {
				url = `/api/administration/players?page=${page}`;
			}
			try {
				const response = await fetch(url);
				if (response.ok) {
					const data = await response.json();
					setData({
						players: data.players,
						totalPages: data.totalPages,
					});
					setIsLoading(false);
				}
			} catch (e) {
				const error: Error = e as Error;
				console.log("Error:", error);
				throw error;
			}
		}, 500);
	}, [searchTerm, page]);

	return (
		<>
			<div className="flex flex-col rounded-sm border">
				<div className="flex items-center justify-between border-b bg-background p-2 text-sm">
					Player Manager
					<div className="flex flex-row items-center gap-2">
						<Button
							variant={"outline"}
							className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
							disabled={page === 1}
							onClick={() => setPage(page - 1)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m14 7l-5 5m0 0l5 5"
								/>
							</svg>
						</Button>
						<span>
							{page} of {data.totalPages}
						</span>
						<Button
							variant={"outline"}
							className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
							disabled={data.totalPages === page}
							onClick={() => setPage(page + 1)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m10 17l5-5l-5-5"
								/>
							</svg>
						</Button>
					</div>
				</div>
				<div className="border-b p-2">
					<Input
						type="text"
						placeholder="Search Player, Email, Account Name..."
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
						autoFocus
					/>

					{/* <Select defaultValue={"all"} >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ban">Ban</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button size={"default"}>Search</Button> */}
				</div>

				<Table>
					<TableHeader className="pointer-events-none">
						<TableRow>
							<TableHead className="w-[80px]">ID</TableHead>
							<TableHead>Player Name:</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isLoading &&
							data?.players?.map((player) => (
								<TableRow key={player.id.toString()}>
									<TableCell>{player.id.toString().padStart(6, "0")}</TableCell>
									<TableCell>{player.name}</TableCell>
									<TableCell className="w-[30px] text-right">
										<ActionsDropdown />
									</TableCell>
								</TableRow>
							))}

						{isLoading && (
							<TableRow>
								<TableCell colSpan={4}>
									<div className="col-span-1 my-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
										<svg
											aria-hidden="true"
											className="h-10 w-10 animate-spin fill-sky-600 text-gray-200 dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span className="sr-only">Loading...</span>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

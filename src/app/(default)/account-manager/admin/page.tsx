import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminManager() {
	const [countAccounts] = await Promise.all([prisma.accounts.findMany()]);

	const [countPlayers] = await Promise.all([prisma.players.findMany()]);
	const [countGuilds] = await Promise.all([prisma.guilds.findMany()]);

	// let countAccounts = [];
	// let countPlayers = [];
	// let countGuilds = [];

	// const [countAccounts, countPlayers, countGuilds] = await Promise.all([
	//   prisma.accounts.findMany(),
	//   prisma.players.findMany({
	//     where: {
	//       id: { not: { in: [1, 2, 3, 4, 5] } },
	//       group_id: { not: { in: [2, 3, 4, 5] } }
	//     }
	//   }),
	//   prisma.guilds.findMany(),
	//   prisma.$disconnect()
	// ]);

	const totalUnregister = countAccounts.reduce((a, account) => {
		if (account.email_verified === false) {
			return a + 1;
		}
		return a;
	}, 0);

	const totalPremium = countAccounts.reduce((a, account) => {
		if (account.premdays > 0) {
			return a + 1;
		}
		return a;
	}, 0);

	return (
		<>
			<div className="flex flex-col rounded-sm border">
				<div className="flex items-center justify-between border-b bg-background p-2 text-sm">
					General information
				</div>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell className="w-[200px]">Accounts:</TableCell>
							<TableCell className="w-full">
								<strong>{countAccounts.length}</strong> / <strong>{totalUnregister}</strong>{" "}
								Unregistered / <strong>{totalPremium}</strong> Premium
							</TableCell>
							<TableCell className="w-[200px] whitespace-nowrap">
								<Link
									href={"/account-manager/admin/accounts"}
									className="text-blue-500 hover:underline"
								>
									Manager Account
								</Link>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Player:</TableCell>
							<TableCell>
								<strong>{countPlayers.length}</strong>
							</TableCell>
							<TableCell className="w-[200px] whitespace-nowrap">
								{" "}
								<Link
									href={"/account-manager/admin/players"}
									className="text-blue-500 hover:underline"
								>
									Manager Player
								</Link>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Guilds:</TableCell>
							<TableCell>
								<strong>{countGuilds.length}</strong>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableBody>
				</Table>

				<div className="flex items-center justify-between border-t border-b bg-background p-2 text-sm">
					Open Tickets
					<div className="flex flex-row items-center gap-2">
						<Button
							variant={"outline"}
							className="stroke h-[24px] w-[24px] bg-card/50 p-0 hover:bg-card"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									className="stroke-card-foreground group-hover:stroke-card-foreground"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m14 7l-5 5m0 0l5 5"
								/>
							</svg>
						</Button>
						<span>0 of 5</span>
						<Button variant={"outline"} className="h-[24px] w-[24px] bg-card/50 p-0 hover:bg-card">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									className="stroke-card-foreground group-hover:stroke-card-foreground"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m10 17l5-5l-5-5"
								/>
							</svg>
						</Button>
					</div>
				</div>
				<Table>
					<TableHeader className="pointer-events-none">
						<TableRow>
							<TableHead className="w-[80px]">Ticket</TableHead>
							<TableHead>Account</TableHead>
							<TableHead className="w-[60px]">Status</TableHead>
							<TableHead className="w-[80px] items-center">Category</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>000001</TableCell>
							<TableCell>I</TableCell>
							<TableCell>
								<Badge variant={"error"}>OPEN</Badge>
							</TableCell>
							<TableCell className="w-[80px] items-center text-center">
								<Badge variant={"default"}>HELP</Badge>
							</TableCell>
						</TableRow>
						<TableRow className="p-0">
							<TableCell colSpan={6} className="p-0">
								<div className="flex items-center justify-between bg-background p-2 text-sm">
									Pending Tickets
									<div className="flex flex-row items-center gap-2">
										<Button
											variant={"outline"}
											className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
											>
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
										<span>0 of 5</span>
										<Button
											variant={"outline"}
											className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
											>
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
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>000001</TableCell>
							<TableCell>I</TableCell>
							<TableCell className="text-center">
								<Badge variant={"warning"}>PENDING</Badge>
							</TableCell>
							<TableCell className="w-[80px] items-center text-center">
								<Badge variant={"default"}>HELP</Badge>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</>
	);
}

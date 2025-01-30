import Pagination from "@/components/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import CreateGuild from "./components/createGuild";
import ListGuilds from "./components/listGuilds";
import Search from "./components/search";

export const revalidate = 0;

const ITEMS_PER_PAGE = 25;

async function fetchGuilds({ page, search }: { search: string; page: number }) {
	const offset = (page - 1) * ITEMS_PER_PAGE;
	try {
		const count = await prisma.guilds.count({
			where: { name: { contains: search ? search : undefined } },
		});

		const guilds = await prisma.guilds.findMany({
			where: { name: { contains: search ? search : undefined } },
			include: {
				players: { select: { id: true, name: true } },
				guild_membership: { select: { players: { select: { id: true } } } },
			},
			take: ITEMS_PER_PAGE,
			skip: offset,
			orderBy: { name: "asc" },
		});

		return { guilds, totalPage: Math.ceil(Number(count) / ITEMS_PER_PAGE) };
	} catch (error) {
		console.error("Database Error:", error);
		return { guilds: [], totalPage: 0 };
	}
}

async function getPlayers(account_id: number) {
	const players = await prisma.players.findMany({
		where: { account_id, level: { gte: 8 }, guild_membership: null },
	});
	return { players };
}

export default async function Guilds(props: {
	searchParams?: Promise<{ search?: string; page?: string }>;
}) {
	const searchParams = await props.searchParams;
	const session = await getServerSession(authOptions);
	const search = searchParams?.search || "";
	const page = Number(searchParams?.page) || 1;
	const { guilds, totalPage } = await fetchGuilds({ page, search });

	const { players } = session?.user.id
		? await getPlayers(+session?.user.id)
		: { players: [] };

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Guilds</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<Suspense key={session?.user.id}>
					<div className="flex items-center justify-between text-sm">
						Can&apos;t find the guild you&apos;re looking for?
						{session?.user.id ? (
							<CreateGuild players={players} />
						) : (
							<Link
								href={"/account-manager/login"}
								className="py-2 text-blue-500"
							>
								Log in to create
							</Link>
						)}
					</div>
				</Suspense>

				<div className="rounded border">
					<div>
						<div className="flex flex-row gap-2 p-2">
							<Search placeholder="Search..." />
							<Pagination totalPages={totalPage} />
						</div>
						<ListGuilds guilds={guilds} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

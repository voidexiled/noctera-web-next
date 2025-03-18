import "../globals.css";
import "./admin.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Provider } from "@/providers/providers";

import configLua from "@/hooks/useConfigLua";
import { getBoostedBoss, getBoostedCreature } from "@/services/BoostedCreaturesService";
import { getServerStatus, getTotalOnline } from "@/services/ServerStatusService";

import { fetchPlayersTopFive } from "@/actions/general/highscores/actions";
import { AdminSidebar } from "@/components/(admin)/sidebar/AdminSidebar";
import DatabaseErrorPage from "@/components/base-layout/DabaseErrorPage";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GetFirstPlayer } from "@/services/players/PlayersService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type React from "react";
import getServerSaveTime from "../../lib/utils";

const lua = configLua();

export const revalidate = 0;

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: {
		default: lua.serverName,
		template: `%s - ${lua.serverName}`,
	},
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let pageContent: React.ReactNode | null | React.ReactNode[];

	const session = await getServerSession(authOptions);
	console.log(session);
	if (!session?.user || !session?.user?.role || session?.user?.role !== "admin" || !session?.user?.id) {
		redirect("/");
	}

	try {
		const [serverSaveTime, isServerOnline, playerOnlineCount, boostedCreature, boostedBoss] = await Promise.all([
			getServerSaveTime(lua),
			getServerStatus(),
			getTotalOnline(),
			getBoostedCreature(),
			getBoostedBoss(),
		]);
		const nowDate = new Date();

		const highscorePlayers = await fetchPlayersTopFive();

		const playerRecord = await prisma.server_config.findFirst({
			where: {
				config: "players_record",
			},
		});

		//const adminCharacter
		const character = await GetFirstPlayer({
			where: {
				account_id: +session?.user?.id,
				group_id: 6,
				AND: [
					{
						accounts: {
							type: 6,
						},
					},
				],
			},
		});

		pageContent = (
			<Provider>
				<SidebarProvider>
					<AdminSidebar
						character={{
							name: character.name,
							email: session.user.email,
						}}
					/>
					<SidebarInset className="bg-background backdrop-blur-sm">
						<header className="flex h-16 shrink-0 items-center gap-2 bg-sidebar transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className=" h-4" />
								<div className="flex items-center">
									<div className="flex gap-1 text-sidebar-foreground/80 text-xs">
										<span>{playerOnlineCount}</span>
										<span>players online</span>
									</div>
								</div>
								<Separator orientation="vertical" className=" h-4" />
								<div className="flex items-center">
									<div className="flex gap-1 text-sidebar-foreground/80 text-xs">
										<span>players record</span>
										<span>{playerRecord?.value}</span>
									</div>
								</div>
							</div>
						</header>
						{/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
							<div className="grid auto-rows-min gap-4 md:grid-cols-3">
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
							</div>
							<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
						</div> */}
						<main className="p-4">{children}</main>
					</SidebarInset>
				</SidebarProvider>
			</Provider>
		);
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		pageContent = <DatabaseErrorPage />; // Usa el componente DatabaseErrorPage
	}

	return <>{pageContent}</>;
}

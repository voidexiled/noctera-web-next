import "../globals.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Provider } from "@/providers/providers";

import { FloatingAdminToolbar } from "@/components/(admin)/FloatingAdminToolbar";
import { AdminToolbarProvider } from "@/components/(admin)/context/AdminToolbarContext";
import { Banner } from "@/components/base-layout/banner/Banner";
import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { Footer } from "@/components/base-layout/footer/Footer";
import { Header } from "@/components/base-layout/header/Header";
import { LeftSidebar } from "@/components/base-layout/left-sidebar/LeftSidebar";
import { RightSidebar } from "@/components/base-layout/right-sidebar/RightSidebar";
import configLua from "@/hooks/useConfigLua";
import { getBoostedBoss, getBoostedCreature } from "@/services/BoostedCreaturesService";
import { getServerStatus, getTotalOnline } from "@/services/ServerStatusService";

import { fetchPlayersTopFive } from "@/actions/general/highscores/actions";
import DatabaseErrorPage from "@/components/base-layout/DabaseErrorPage";
import type React from "react";
import { Toaster } from "sonner";
import getServerSaveTime, { cn } from "../../lib/utils";

const lua = configLua();

export const revalidate = 0;

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: {
		default: lua.serverName,
		template: `%s - ${lua.serverName}`,
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let pageContent: React.ReactNode | null | React.ReactNode[];

	try {
		const [serverSaveTime, isServerOnline, playerOnlineCount, boostedCreature, boostedBoss] =
			await Promise.all([
				getServerSaveTime(lua),
				getServerStatus(),
				getTotalOnline(),
				getBoostedCreature(),
				getBoostedBoss(),
			]);
		const nowDate = new Date();

		const highscorePlayers = await fetchPlayersTopFive();

		pageContent = (
			<Provider>
				<ScrollArea className="h-screen w-full">
					<div className="px-4 py-4 md:px-2 md:py-0">
						<Banner />
						<main className="mx-auto grid max-w-(--breakpoint-xl) grid-cols-1 space-y-2 md:grid-cols-12 md:space-x-2 md:space-y-0 xl:max-w-(--breakpoint-xl)">
							<LeftSidebar />
							<article className="col-span-8 space-y-2 pb-8">
								<Header isServerOnline={isServerOnline} playerOnlineCount={playerOnlineCount} />
								<TransparentContainer as="section">
									<main className="flex flex-col gap-2 rounded-md">{children}</main>
								</TransparentContainer>
								<Footer />
							</article>
							<RightSidebar
								serverSaveTime={{
									hour: serverSaveTime.serverSaveHours,
									min: serverSaveTime.serverSaveMinutes,
									sec: serverSaveTime.serverSaveSeconds,
								}}
								nowDate={nowDate}
								boostedCreature={boostedCreature}
								boostedBoss={boostedBoss}
								highscorePlayers={highscorePlayers}
							/>
						</main>
					</div>
				</ScrollArea>
				{/* <AdminToolbarProvider>
					<FloatingAdminToolbar />
				</AdminToolbarProvider> */}
			</Provider>
		);
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		pageContent = <DatabaseErrorPage />; // Usa el componente DatabaseErrorPage
	}

	return <>{pageContent}</>;
}

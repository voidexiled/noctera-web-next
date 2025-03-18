import "./globals.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import configLua from "@/hooks/useConfigLua";

import { cn } from "@/lib/utils";
import type React from "react";
import { Toaster } from "sonner";

const lua = configLua();

export const revalidate = 0;

const inter = Inter({ subsets: ["latin"], weight: "400" });
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
	return (
		<html lang="es" className="dark">
			<link rel="canonical" href="https://noctera-global.com" />
			<meta
				name="description"
				content="Join now to Noctera Global, a free and open-source MMORPG. Experience thrilling online adventure, quests, and a vibrant community. Explore numerous maps and new features, all in a dynamic and engaging gaming environment."
			/>
			<meta
				name="keywords"
				content="noctera, global, tibia, mmorpg, server, free, top, ot, online, wiki, 13.40, 13.20, 13.00, 12.40, 12.20, 12.00, 11.40, 11.20, 11.00, 10.40, 10.20, 10.00, 9.40, 9.20, 9.00, 8.40, 8.20, 8.00, 7.40, 7.20, 7.00, 6.40, 6.20, 6.00, 5.40, 5.20, 5.00"
			/>
			<body className={cn(inter.className, "text-foreground")}>
				{children}
				<Toaster
					position="bottom-center"
					theme="dark"
					closeButton
					richColors
					className="z-[200]"
					toastOptions={{
						className: "z-[200]",
					}}
				/>
			</body>
		</html>
	);
}

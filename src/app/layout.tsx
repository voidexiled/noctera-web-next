import "./globals.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

import MainMenu from "@/components/main-menu/main-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "@/providers/providers";
import Link from "next/link";

import { IconiFy } from "@/components/Iconify";
import { Typography } from "@/components/Typography";
import Boosted from "@/components/animations/boosted";
import CountDown from "@/components/count-down";
import LoginBox from "@/components/login-box";
import RashidBox from "@/components/rashid-box";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import configLua from "@/hooks/configLua";
import { prisma } from "@/lib/prisma";
import { StatusServer } from "@/utils/statusServer";
import { cn } from "../lib/utils";

const lua = configLua();

export const revalidate = 0;

export const metadata: Metadata = {
	title: {
		default: lua.serverName,
		template: `%s - ${lua.serverName}`,
	},
};

export async function status() {
	try {
		const statusServer = new StatusServer();
		const host = lua.ip.split(" ")[0];
		const port = +lua.statusProtocolPort;
		const status = await statusServer.getStatus(host, port);
		console.log("status: ", status);
		return {
			status: !!status,
		};
	} catch (error) {
		console.error("Ocorreu um erro ao verificar o status do servidor:", error);
		return {
			status: false,
		};
	}
}

async function boostedBoss() {}

export async function totalOnline() {
	try {
		const som = await prisma.players_online.count();
		return som;
	} catch (error) {
		console.error(
			"Ocorreu um erro ao contar o toral de players online:",
			error,
		);
		return 0;
	}
}

// function extractIdsFromArrayOfObjects(array: any) {
// 	function extractIdFromUrl(url: string) {
// 		const match = url.match(/id=(\d+)/);
// 		return match ? match[1] : null;
// 	}

// 	function extractIdsFromObject(obj: any) {
// 		const id = extractIdFromUrl(obj.value);
// 		return { id, config: obj.config };
// 	}

// 	return array.map(extractIdsFromObject);
// }

// async function getSeverConfig(value: string) {
// 	const array1 = await prisma.$queryRaw<{
// 		config: string;
// 		value: string;
// 	}>`SELECT * from server_config WHERE config = ${value}`;

// 	return extractIdsFromArrayOfObjects(array1);
// }

async function getBoostedCreature() {
	const boostedCreature = await prisma.boosted_creature.findMany({
		take: 1,
	});
	return boostedCreature;
}

async function getBoostedBoss() {
	const boostedBoss = await prisma.boosted_boss.findMany({
		take: 1,
	});
	return boostedBoss;
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const statusServer = await status();
	const countOnline = await totalOnline();

	const boostedCreature = await getBoostedCreature();
	const boostedBoss = await getBoostedBoss();

	const globalServerSaveTime: string = lua.globalServerSaveTime;
	const globalServerSaveNotifyMessage: string =
		lua.globalServerSaveNotifyMessage;
	const globalServerSaveNotifyDuration: string =
		lua.globalServerSaveNotifyDuration;

	console.log(globalServerSaveTime);
	console.log(globalServerSaveNotifyMessage);
	console.log(globalServerSaveNotifyDuration);

	const globalServerSaveTimeHours = Number.parseInt(
		globalServerSaveTime.split(":")[0],
	);
	const globalServerSaveTimeMinutes = Number.parseInt(
		globalServerSaveTime.split(":")[1],
	);
	const globalServerSaveTimeSeconds = Number.parseInt(
		globalServerSaveTime.split(":")[2],
	);

	const isGlobalServerSaveNotificationEnabled =
		globalServerSaveNotifyMessage  === "true";
	const globalServerSaveNotifyDurationMinutes =
		isGlobalServerSaveNotificationEnabled
			? Number.parseInt(globalServerSaveNotifyDuration)
			: 0;

	const serverSaveTotalSeconds =
		globalServerSaveTimeHours * 3600 +
		globalServerSaveTimeMinutes * 60 +
		globalServerSaveTimeSeconds +
		(isGlobalServerSaveNotificationEnabled
			? globalServerSaveNotifyDurationMinutes * 60
			: 0);
			
	const serverSaveHours = Math.floor(serverSaveTotalSeconds / 3600);
	const serverSaveMinutes = Math.floor((serverSaveTotalSeconds % 3600) / 60);
	const serverSaveSeconds = Math.floor((serverSaveTotalSeconds % 3600) % 60);

	return (
		<html lang="en" className="dark">
			<body
				className={cn(inter.className, "bg-background text-foreground")}
				suppressHydrationWarning
			>
				<>
					<Provider>
						{/* <video className="fixed top-0 left-0 min-w-full min-h-full -z-1 object-cover" autoPlay muted playsInline loop>
              <source src="/movies/logo.webm" type="video/webm" />
            </video> */}
						<ScrollArea className="h-screen w-full px-2">
							<div className="mx-auto mt-10 mb-4 hidden max-w-screen-xl grid-cols-1 space-y-2 sm:grid sm:grid-cols-12 sm:space-x-2 sm:space-y-0">
								<div className="col-span-2 space-y-2">
									{/* <Link href="/">
                    <Image src={'/testlogo2.png'} priority width={212} height={200} className='w-auto h-auto' alt='Logo' />
                  </Link> */}
								</div>
								<div className="col-span-8 space-y-2">
									<div className="flex items-center justify-center">
										<Link href="/">
											{/* <video className='w-[380px]' autoPlay muted playsInline loop>
                        <source src="/movies/logo.webm" type="video/webm" />
                      </video> */}
											<Image
												alt="Noctera Global Logo"
												src="/movies/logo2.png"
												width={300}
												height={160}
											/>
										</Link>
									</div>
								</div>

								{/* <div className='sm:col-span-2 col-span-1 hidden sm:block gap-2'>
                  <div className='flex flex-row justify-center items-end h-full pb-2 gap-2'>
                    <div className='bg-background/10 shadow rounded-sm backdrop-blur-[6px] p-3'>
                      <Boosted boosted={{
                        boostname: boostedCreature[0].looktype.toString(),
                        lookaddons: 0,
                        lookbody: 0,
                        lookfeet: 0,
                        lookhead: 0,
                        looklegs: 0,
                        lookmount: 0,
                        looktype: boostedCreature[0].looktype
                      }} kind="creature" />
                    </div>
                    <div className='bg-background/10 shadow rounded-sm backdrop-blur-[6px] p-3'>
                      <Boosted boosted={{
                        boostname: boostedBoss[0].looktype.toString(),
                        lookaddons: 0,
                        lookbody: 0,
                        lookfeet: 0,
                        lookhead: 0,
                        looklegs: 0,
                        lookmount: 0,
                        looktype: boostedBoss[0].looktype
                      }} kind="boss" />
                    </div>
                  </div>
                </div> */}
							</div>
							<div className="mx-auto grid max-w-screen-xl grid-cols-1 space-y-2 sm:grid-cols-12 sm:space-x-2 sm:space-y-0">
								<div className="col-span-1 gap-2 space-y-2 sm:col-span-2 ">
									<LoginBox />

									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<div className="flex flex-col space-y-2">
											<Button size={"lg"} variant={"green"} asChild>
												<Link
													href={"/download"}
													className="justify-start gap-2"
												>
													Download
												</Link>
											</Button>
										</div>
									</div>

									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<MainMenu />
									</div>
								</div>

								<div className="col-span-8 space-y-2 pb-8">
									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<div className="flex items-center justify-between rounded-sm bg-background p-1">
											<div className="flex flex-row gap-4">
												<Link
													href={"/download"}
													className="flex flex-row items-center text-xs"
												>
													<IconiFy icon={"line-md:download-loop"} /> Download
												</Link>
												<Link
													href={process.env.DISCORD_URL ?? "#"}
													className="flex flex-row items-center text-xs"
												>
													<IconiFy icon={"line-md:discord"} className="w-6" />{" "}
													Discord
												</Link>
												{/* <Link href={process.env.YOUTUBE_URL ?? ' #'} className='flex flex-row items-center text-xs '>
                          <IconiFy icon={'line-md:youtube'} className='w-6' /> YouTube
                        </Link>
                        <Link href={process.env.INSTAGRAM_URL ?? '#'} className='flex flex-row items-center text-xs '>
                          <IconiFy icon={'line-md:instagram'} className='w-6' /> Instagram
                        </Link> */}
												<Link
													href={process.env.FACEBOOK_URL ?? "#"}
													className="flex flex-row items-center text-xs "
												>
													<IconiFy icon={"line-md:facebook"} className="w-6" />{" "}
													Facebook
												</Link>
												<Link
													href={process.env.WHATSAPP_URL ?? "#"}
													className="flex flex-row items-center text-xs "
												>
													<IconiFy
														icon={"ic:twotone-whatsapp"}
														className="w-6"
													/>{" "}
													Whatsapp
												</Link>
											</div>

											<div className="flex items-center space-x-1 p-1 px-2">
												{statusServer.status ? (
													<Badge variant={"info"}>{countOnline} players</Badge>
												) : (
													<Badge variant={"error"}>OFFLINE</Badge>
												)}
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										{children}
									</div>

									<div className="flex justify-between rounded-md bg-background/10 p-1 shadow-md backdrop-blur-[6px]">
										<div className="flex h-full w-full justify-between gap-2 rounded-md bg-card p-2">
											<Typography variant={"overline"} className="">
												Noctera-Global &copy; 2024
											</Typography>
											<div className="flex flex-row items-center gap-2">
												<Typography variant={"overline"} className="">
													Contact Support
												</Typography>
												<Typography variant={"overline"} className="">
													<Link href="#">
														{" "}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 24 24"
														>
															<g
																fill="none"
																stroke="currentColor"
																strokeWidth="1.5"
															>
																<path d="M3.2 14.222V4a2 2 0 0 1 2-2h13.6a2 2 0 0 1 2 2v10.222m-17.6 0h17.6m-17.6 0l-1.48 5.234A2 2 0 0 0 3.644 22h16.712a2 2 0 0 0 1.924-2.544l-1.48-5.234" />
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M11 19h2m1-13l2 2l-2 2m-4-4L8 8l2 2"
																/>
															</g>
														</svg>
													</Link>
												</Typography>
											</div>
										</div>
									</div>
								</div>

								<div className="col-span-1 gap-2 space-y-2 sm:col-span-2 ">
									<div className="w-full rounded-sm bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<Card>
											<CardHeader className="border-b">
												<CardTitle className="grid grid-cols-2 text-center">
													<div>Creature</div>
													<div>Boss</div>
												</CardTitle>
											</CardHeader>
											<CardContent className="flex flex-row justify-between">
												{boostedCreature?.[0] && (
													<Boosted
														boosted={{
															boostname: boostedCreature[0].boostname,
															lookaddons: 0,
															lookbody: 0,
															lookfeet: 0,
															lookhead: 0,
															looklegs: 0,
															lookmount: 0,
															looktype: boostedCreature[0].looktype,
														}}
														kind="creature"
													/>
												)}

												{boostedBoss?.[0] && (
													<Boosted
														boosted={{
															boostname: boostedBoss[0].boostname,
															lookaddons: 0,
															lookbody: 0,
															lookfeet: 0,
															lookhead: 0,
															looklegs: 0,
															lookmount: 0,
															looktype: boostedBoss[0].looktype,
														}}
														kind="boss"
													/>
												)}
											</CardContent>
										</Card>
									</div>
									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<CountDown
											hour={serverSaveHours}
											min={serverSaveMinutes}
											sec={serverSaveSeconds}
										/>
									</div>
									<div className="flex flex-col gap-2 rounded-md bg-background/10 p-1 shadow backdrop-blur-[6px]">
										<RashidBox />
									</div>
								</div>
							</div>
						</ScrollArea>
					</Provider>
					<Toaster />
				</>
			</body>
		</html>
	);
}

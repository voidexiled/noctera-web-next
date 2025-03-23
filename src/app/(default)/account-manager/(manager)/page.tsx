import Image from "next/image";

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { LogoutButton } from "@/components/base-layout/left-sidebar/LogoutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fUnixToDate } from "@/utils/functions/formatDate";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { countries } from "@/components/(account-manager)/(manager)/data/countries";
import TwoFactSettings from "@/components/(account-manager)/(manager)/manager/TwoFactSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ChangeEmailButton } from "@/components/(account-manager)/(manager)/manager/ChangeEmailButton";
import { ChangePasswordButton } from "@/components/(account-manager)/(manager)/manager/ChangePasswordButton";
import CharactersList from "@/components/(account-manager)/(manager)/manager/CharactersList";
import { CreateCharacterButton } from "@/components/(account-manager)/(manager)/manager/CreateCharacterButton";
import { ResendVerificationEmailButton } from "@/components/(account-manager)/(manager)/manager/ResendVerificationEmailButton";
import InvitedToGuildAlert from "@/components/kokonutui/InvitedToGuildAlert";
import { GetAccountUnique } from "@/services/accounts/AccountsService";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { InfoCircledIcon } from "@radix-ui/react-icons";

// TODO: Implement tickets
// TODO: Implement

type Params = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function AccountManagerPage(props: Params) {
	const searchParams = await props.searchParams;
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) redirect("/");

	const acc = await GetAccountUnique({
		where: { id: Number(user?.id) },
		include: {
			players: {
				include: {
					guild_invites: {
						include: {
							players: true,
							guilds: true,
						},
					},
				},
			},
			account_bans: true,
		},
	});

	if (!acc) redirect("/");

	const ids = acc.players.map((i) => i.id);

	const playersOnline = await prisma.players_online.findMany({
		where: { AND: [{ player_id: { in: ids } }] },
		select: { player_id: true },
	});

	const lastLogin = acc.players.sort((a, b) => Number(b.lastlogin) - Number(a.lastlogin));

	const InitialTab = searchParams?.tab ?? "status";

	const accountCountry = countries.find((c) => c.value.toLowerCase() === acc.country.toLowerCase());

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Account Manager</CardTitle>
			</CardHeader>

			{/* Warning not verified email */}
			{!acc.key ||
				(acc.email_verified === false && (
					<div className="p-2 pb-0">
						<Alert variant="destructive" className="rounded-sm">
							<AlertTitle>Warning!</AlertTitle>
							<AlertDescription>
								<div className="flex flex-row gap-2">
									<ResendVerificationEmailButton accountName={acc.name} accountEmail={acc.email} />
								</div>
							</AlertDescription>
						</Alert>
					</div>
				))}

			{/* Guild invites */}
			{acc.players.filter((player) => player.guild_invites.length).length > 0 &&
				(() => {
					const { date: invitedAt } = acc.players.filter((player) => player.guild_invites.length)[0]
						.guild_invites[0];

					const { id: playerId, name: playerName } = acc.players.filter(
						(player) => player.guild_invites.length,
					)[0].guild_invites[0].players;

					const {
						id: guildId,
						name: guildName,
						logo_name: guildLogo,
					} = acc.players.filter((player) => player.guild_invites.length)[0].guild_invites[0]
						.guilds;

					return (
						<div className="rounded-md p-2 pb-0">
							<InvitedToGuildAlert
								characterName={playerName}
								guildName={guildName}
								guildLogo={guildLogo}
								guildId={guildId}
								playerId={playerId}
								invitedAt={invitedAt}
							/>
						</div>
					);
				})()}

			{/* Header */}
			<div className="space-y-2 p-2">
				<div className="rounded-sm border">
					<div className="flex gap-2 p-2 sm:flex-row sm:justify-between">
						<div className="grow">
							<div className="mb-2 flex items-start justify-start rounded-sm bg-background/60 p-2 text-sm">
								Account Status
							</div>
							<div className="flex items-center gap-2 py-2 leading-none">
								<Image
									src={acc?.premdays ? "/account/status_green.gif" : "/account/status_red.gif"}
									width={42}
									height={42}
									alt={acc?.premdays ? "Premium" : "Free"}
								/>
								<div>
									<Typography
										variant={"h6"}
										className={`text-2xl ${acc?.premdays ? "text-green-500" : "text-red-500"}`}
									>
										{acc?.premdays ? "VIP Account" : "Free Account"}
									</Typography>
									<Typography variant={"overline"} className="text-sm dark:text-zinc-300 ">
										{acc?.premdays ? (
											<>
												Balance of VIP Time: <strong>{acc?.premdays}</strong> days
											</>
										) : (
											"To benefit from our great VIP features, get VIP Time for your account."
										)}
									</Typography>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							{user?.role === "admin" && (
								<Button variant={"destructive"} className="whitespace-nowrap" asChild>
									<Link href={"/account-manager/admin"}>Admin Panel</Link>
								</Button>
							)}
							<Button className="whitespace-nowrap" asChild>
								<Link href={"/donate"}>Donate</Link>
							</Button>
							<LogoutButton />
						</div>
					</div>
				</div>
			</div>

			{/* Body */}
			<Tabs defaultValue={InitialTab} className="rounded-sm p-2 pt-0" activationMode="manual">
				<TabsList className="w-full rounded-sm border-[1px] bg-background/60">
					<TabsTrigger value="status" className="rounded-sm">
						Status
					</TabsTrigger>
					<TabsTrigger value="account" className="rounded-sm">
						Account
					</TabsTrigger>
					<TabsTrigger value="history" className="rounded-sm">
						History
					</TabsTrigger>
					<TabsTrigger value="tickets" className="rounded-sm">
						Tickets
					</TabsTrigger>
					<TabsTrigger value="security" className="rounded-sm">
						Security
					</TabsTrigger>
				</TabsList>

				<TabsContent value="status" className="">
					<div className="space-y-2">
						<div className="space-y-2">
							<div className="flex flex-col rounded-sm border">
								<div className="flex items-start justify-start border-b bg-background/60 p-2 text-sm">
									General Information
								</div>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Full name:</TableCell>
											<TableCell className="">{acc.rlname}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Email Address:</TableCell>
											<TableCell className="">
												{acc?.email}{" "}
												<span className="text-rose-500">
													{!acc?.email_verified && "(Not Verified)"}
												</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Phone:</TableCell>
											<TableCell className="">{acc.phone}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="flex flex-row gap-2">
												Country:{" "}
												<TooltipProvider>
													<Tooltip delayDuration={150}>
														<TooltipTrigger>
															<InfoCircledIcon className="size-4 text-zinc-500 hover:text-zinc-400" />
														</TooltipTrigger>
														<TooltipContent>
															<span>
																How to change your country?
																<br />
																R. Open a ticket to contact the Noctera Staff
															</span>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</TableCell>
											<TableCell className="">{accountCountry?.label}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Created:</TableCell>
											<TableCell className="">{fUnixToDate(acc.creation)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Last Login (Game):</TableCell>
											<TableCell className="">
												{fUnixToDate(Number(lastLogin[0]?.lastlogin))}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Last Login (Website):</TableCell>
											<TableCell className="">{fUnixToDate(acc.web_lastlogin ?? 0)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Noctera Coins:</TableCell>
											<TableCell className="flex items-center gap-1">
												{acc?.coins_transferable}{" "}
												<TooltipProvider>
													<Tooltip delayDuration={150}>
														<TooltipTrigger>
															<Image
																src="/icons/icon-tibiacointrusted.png"
																alt="tibiacointrusted"
																width={16}
																height={16}
																className=" h-auto w-auto"
															/>
														</TooltipTrigger>
														<TooltipContent>
															<span className="text-xs">Noctera Coins</span>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>{" "}
												( include {acc?.coins.toString()}{" "}
												<TooltipProvider>
													<Tooltip delayDuration={150}>
														<TooltipTrigger>
															<Image
																src="/icons/icon-tibiacoin.png"
																alt="tibiacointrusted"
																width={16}
																height={16}
																className=" h-auto w-auto"
															/>
														</TooltipTrigger>
														<TooltipContent>
															<span className="text-xs">No Transferable Coins</span>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
												)
											</TableCell>
										</TableRow>
										{/* 
										<TableRow>
											<TableCell className="w-[170px]">Tournament Coins:</TableCell>
											<TableCell className="flex flex-row items-center gap-1">
												{acc?.tournamentBalance.toString()}
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Image
																src="/icons/icon-tournamentcoin.png"
																alt="tibiacointrusted"
																width={16}
																height={16}
																className=" h-auto w-auto"
															/>
														</TooltipTrigger>
														<TooltipContent>
															<p>Tournament Coins</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</TableCell>
										</TableRow>{" "}
										*/}
									</TableBody>
								</Table>
							</div>
						</div>

						<CharactersList
							chars={convertBigIntsToNumbers(acc?.players)}
							playerOnline={playersOnline}
						/>
						<div className="flex justify-end pt-2">
							<CreateCharacterButton />
						</div>
					</div>
				</TabsContent>

				<TabsContent value="account" className="space-y-2">
					<div className="space-y-2">
						<div className="space-y-2">
							<div className="grid grid-cols-3 gap-2">
								<ChangePasswordButton />
								<ChangeEmailButton />
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="history" className="space-y-2">
					<div className="space-y-2">
						{/* <div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 leading-none">
							<div>
								<Typography variant={"h5"} className="text-sm">
									VIP History
								</Typography>
								<Typography variant={"body1"} className="text-sm" component={"p"}>
									Contains all historical data about your VIP Times.
								</Typography>
							</div>
							<Button size={"sm"} className="whitespace-nowrap" asChild>
								<Link href={"/account-manager/premium-history"}>View History</Link>
							</Button>
						</div> */}
						<div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 leading-none">
							<div>
								<Typography variant={"h5"} className="text-sm">
									Payments History
								</Typography>
								<Typography variant={"body1"} className="text-sm" component={"p"}>
									Contains all historical data of your payments.
								</Typography>
							</div>
							<Button size={"sm"} className="whitespace-nowrap" asChild>
								<Link href={"/account-manager/payments-history"}>View History</Link>
							</Button>
						</div>
						<div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 leading-none">
							<div>
								<Typography variant={"h5"} className="text-sm">
									Coins History
								</Typography>
								<Typography variant={"body1"} className="text-sm">
									Contains all historical data about your Tibia Coins and products buyable with
									Tibia Coins.
								</Typography>
							</div>
							<Button size={"sm"} className="whitespace-nowrap">
								<Link href={"/account-manager/coins-history"}>View History</Link>
							</Button>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="tickets" className="space-y-2">
					<div>
						<div className="flex flex-row items-start space-x-3 space-y-1 rounded-md border p-2 leading-none">
							Tickets
						</div>
					</div>
				</TabsContent>

				<TabsContent value="security" className="space-y-2">
					<div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 leading-none">
						<div>
							<Typography variant={"body1"} className="text-sm text-zinc-300" component={"p"}>
								Two-Factor authentication offers you an additional layer of security to help prevent
								unauthorised access to your Noctera Global account.
							</Typography>
							<ul className=" py-2 pl-8">
								<li>
									<div className="flex flex-row justify-between">
										Two-Factor Authenticator App <TwoFactSettings user={acc} />
									</div>
								</li>
							</ul>
						</div>
					</div>

					{/* <div className="flex justify-end gap-2">
						<ConfirmDeletionAccount />
					</div> */}
				</TabsContent>
			</Tabs>
		</Card>
	);
}

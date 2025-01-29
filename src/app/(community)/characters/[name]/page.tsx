import { Typography } from "@/components/Typography";
import OutfitComponent from "@/components/animations/AnimatedOutfit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { fUnixToDate } from "@/utils/functions/formatDate";
import { getVocation } from "@/utils/functions/getVocations";
import Link from "next/link";
import { redirect } from "next/navigation";

const SLOTS: Record<string, number> = {
	HELMET: 1,
	NECKLACE: 2,
	BACKPACK: 3,
	HANDLEFT: 4,
	ARMOR: 5,
	HANDRIGHT: 6,
	LEGS: 7,
	BOOTS: 8,
	RING: 9,
	AMMO: 10,
};

const EMPTY_SLOTS: {
	pid: number;
	imageName: string;
}[] = [
	{ pid: SLOTS.NECKLACE, imageName: "no_necklace" },
	{ pid: SLOTS.HELMET, imageName: "no_helmet" },
	{ pid: SLOTS.BACKPACK, imageName: "no_backpack" },
	{ pid: SLOTS.HANDLEFT, imageName: "no_handleft" },
	{ pid: SLOTS.ARMOR, imageName: "no_armor" },
	{ pid: SLOTS.HANDRIGHT, imageName: "no_handright" },
	{ pid: SLOTS.RING, imageName: "no_ring" },
	{ pid: SLOTS.LEGS, imageName: "no_legs" },
	{ pid: SLOTS.AMMO, imageName: "no_ammo" },
	{ pid: SLOTS.BOOTS, imageName: "no_boots" },
];

async function isOnline(player_id: number) {
	const query = await prisma.players_online.findFirst({ where: { player_id } });
	if (query) {
		return true;
	}
	return false;
}

export default async function Character({
	params,
}: { params: { name: string } }) {
	const player = await prisma.players.findFirst({
		where: {
			AND: [
				{
					name: {
						equals: params.name ? decodeURIComponent(params.name) : undefined,
					},
				},
				{ id: { not: { in: [1, 2, 3, 4, 5] } } },
				{ group_id: { not: { in: [6] } } },
			],
		},
		include: {
			accounts: {
				select: {
					id: true,
					created: true,
					premdays: true,
					account_bans: true,
					players: {
						where: { hidden: false },
						select: {
							id: true,
							name: true,
							level: true,
							vocation: true,
							sex: true,
							hidden: true,
						},
						orderBy: {
							created: "asc",
						},
					},
				},
			},
			guilds: {
				select: {
					name: true,
					ownerid: true,
					guild_ranks: {
						select: {
							level: true,
						},
					},
				},
			},
			guild_membership: {
				include: {
					guild_ranks: true,
					guilds: true,
				},
			},
			player_items: true,
		},
	});

	if (!player) redirect("/characters");

	const deaths = await prisma.player_deaths.findMany({
		where: { player_id: player.id },
		take: 5,
		orderBy: { time: "desc" },
	});

	const LoyaltRaking = (raking: number) => {
		if (raking >= 5000 && raking < 10000) {
			return "John Cena";
		}
		if (raking >= 10000 && raking < 15000) {
			return "Bruce Lee";
		}
		if (raking >= 15000 && raking < 20000) {
			return "Jackie Chan";
		}
		if (raking >= 20000 && raking < 25000) {
			return "Rocky Balboa";
		}
		if (raking >= 25000 && raking < 30000) {
			return "Van Damme";
		}
		if (raking >= 30000 && raking < 35000) {
			return "The Rock";
		}
		if (raking >= 35000 && raking < 40000) {
			return "Arnold Schwarzenegger";
		}
		if (raking >= 40000 && raking < 45000) {
			return "Vin Diesel";
		}
		if (raking >= 45000 && raking < 50000) {
			return "Latrel";
		}
		if (raking >= 50000) {
			return "Chuck Norris";
		}
		return "No Ranking";
	};

	const playerInventory = player.player_items.filter(
		(item) => item.pid >= 1 && item.pid <= 10,
	);

	function getEmptySlotImage(pid: number) {
		return EMPTY_SLOTS.find((slot) => slot.pid === pid)?.imageName ?? "";
	}

	function getItemImage(pid: number): string {
		const itemType = playerInventory.find((item) => item.pid === pid)?.itemtype;
		if (!itemType) return `/animated-items/${getEmptySlotImage(pid)}.gif`;
		return `/animated-items/${itemType}.gif`;
	}

	const inventoryImages: {
		pid: number;
		imageName: string;
	}[] = [
		{
			pid: SLOTS.NECKLACE,
			imageName: getItemImage(SLOTS.NECKLACE),
		},
		{
			pid: SLOTS.HELMET,
			imageName: getItemImage(SLOTS.HELMET),
		},
		{
			pid: SLOTS.BACKPACK,
			imageName: getItemImage(SLOTS.BACKPACK),
		},
		{
			pid: SLOTS.HANDLEFT,
			imageName: getItemImage(SLOTS.HANDLEFT),
		},
		{
			pid: SLOTS.ARMOR,
			imageName: getItemImage(SLOTS.ARMOR),
		},
		{
			pid: SLOTS.HANDRIGHT,
			imageName: getItemImage(SLOTS.HANDRIGHT),
		},
		{
			pid: SLOTS.RING,
			imageName: getItemImage(SLOTS.RING),
		},
		{
			pid: SLOTS.LEGS,
			imageName: getItemImage(SLOTS.LEGS),
		},
		{ pid: SLOTS.AMMO, imageName: getItemImage(SLOTS.AMMO) },
		{
			pid: SLOTS.BOOTS,
			imageName: getItemImage(SLOTS.BOOTS),
		},
	];

	function getInventoryImage(pid: number) {
		return inventoryImages.find((slot) => slot.pid === pid)?.imageName ?? "";
	}

	function getExpForLevel(level: number): number {
		const tempLevel = level - 1;
		return Math.floor(
			(50 * tempLevel * tempLevel * tempLevel -
				150 * tempLevel * tempLevel +
				400 * tempLevel) /
				3,
		);
	}

	function calculateExperience(playerExperience: bigint, playerLevel: number) {
		const expCurrent = BigInt(getExpForLevel(playerLevel));
		const expNext = BigInt(getExpForLevel(playerLevel + 1));
		const expLeft = expNext - playerExperience;
		const expLeftPercent = Math.max(
			0,
			Math.min(
				100,
				Number(
					((playerExperience - expCurrent) * BigInt(100)) /
						(expNext - expCurrent),
				),
			),
		);
		return {
			expLeft,
			expLeftPercent: expLeftPercent.toFixed(2),
		};
	}

	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Characters</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 p-2">
					<div className="flex flex-col rounded-sm border">
						<div className="flex items-start justify-start bg-background p-2">
							Character Information
						</div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="w-[140px]">Name:</TableCell>
									<TableCell>{player?.name}</TableCell>
								</TableRow>

								<TableRow>
									<TableCell>Sex:</TableCell>
									<TableCell>{player?.sex === 0 ? "Female" : "Male"}</TableCell>
								</TableRow>

								<TableRow>
									<TableCell>Vocation:</TableCell>
									<TableCell>{getVocation(player?.vocation ?? 0)}</TableCell>
								</TableRow>

								<TableRow>
									<TableCell>Level:</TableCell>
									<TableCell>{player?.level}</TableCell>
								</TableRow>

								{/* <TableRow>
                  <TableCell>Residence:</TableCell>
                  <TableCell>{player?.level}</TableCell>
                </TableRow> */}

								{player.guild_membership?.guilds && (
									<TableRow>
										<TableCell>Guild Membership:</TableCell>
										<TableCell>
											{player?.guild_membership?.guild_ranks.name} of the{" "}
											<Link
												href={`/guilds/${player.guild_membership?.guilds.name}`}
												className="text-blue-500 hover:underline"
											>
												{player.guild_membership?.guilds.name}
											</Link>
										</TableCell>
									</TableRow>
								)}
								{/*
                {player.guilds?.name && (<TableRow>
                  <TableCell>Guild Membership:</TableCell>
                  <TableCell> A Leader of the <Link href={`/guilds/${player.guilds?.name}`} className="text-blue-500 hover:underline">{player.guilds?.name}</Link></TableCell>
                </TableRow>)} */}

								<TableRow>
									<TableCell>Last Login:</TableCell>
									<TableCell>
										{player?.lastlogin
											? fUnixToDate(Number(player?.lastlogin))
											: "never"}
									</TableCell>
								</TableRow>

								{player?.comment && (
									<TableRow>
										<TableCell>Comment:</TableCell>
										<TableCell>{player?.comment}</TableCell>
									</TableRow>
								)}

								<TableRow>
									<TableCell>Account Status:</TableCell>
									<TableCell
										className={
											player?.accounts.premdays ? "text-green-600" : ""
										}
									>
										{player?.accounts.premdays ? (
											<Badge variant={"success"}>VIP Account</Badge>
										) : (
											<Badge variant={"destructive"}>Free Account</Badge>
										)}
									</TableCell>
								</TableRow>
								<TableRow className="row-span-2">
									<TableCell>{/* TEST  */}</TableCell>
								</TableRow>
							</TableBody>
						</Table>

						{/* <div className='flex p-2 items-start justify-start  bg-background text-sm text-red-500'>
              Roles Violation Record Details
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[140px]">Date:</TableCell>
                  <TableCell>{fUnixToDate(Number(player?.accounts.create_date))}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="w-[140px]">Reason:</TableCell>
                  <TableCell>{fUnixToDate(Number(player?.accounts.create_date))}</TableCell>
                </TableRow>

              </TableBody>
            </Table> */}

						<div className="flex items-start justify-start bg-background p-2 text-sm">
							Account Information
						</div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="w-[140px]">Created:</TableCell>
									<TableCell>
										{fUnixToDate(Number(player?.accounts.created))}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>

						<div className="flex items-start justify-start bg-background p-2 text-sm">
							Character Information
						</div>
						<Table>
							<TableBody>
								{/* <TableRow>
                  <TableCell className="w-[140px]">Loyalty Title:</TableCell>
                  <TableCell>{LoyaltRaking(player.loyalt_store)}</TableCell>
                </TableRow> */}
								<TableRow>
									<TableCell>Created:</TableCell>
									<TableCell>{fUnixToDate(Number(player?.created))}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>

					<div className="flex flex-col rounded-sm border">
						<div className="flex items-start justify-start bg-background p-2 text-sm">
							Character Deaths
						</div>
						<Table>
							<TableBody>
								{deaths.map((death, index) => {
									return (
										<TableRow key={death.time}>
											<TableCell className="text-right">{index + 1}</TableCell>
											<TableCell className="whitespace-nowrap">
												{fUnixToDate(Number(death.time))}
											</TableCell>
											<TableCell className="w-full">
												{player?.name} died at level <b>{death.level}</b> by{" "}
												{death.is_player && "a "}{" "}
												{death.is_player ? (
													<Link
														href={`/characters/${death.killed_by}`}
														className="text-blue-500"
													>
														{death.killed_by}
													</Link>
												) : (
													death.killed_by
												)}{" "}
											</TableCell>
										</TableRow>
									);
								})}

								{deaths.length === 0 && (
									<TableRow>
										<TableCell colSpan={4}>
											<Typography variant="overline" className="text-center">
												Never died.
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Character Info */}
					<div className="jusitfy-center grid grid-cols-[200px_1fr] items-center gap-2 rounded-sm border p-2">
						{/* Outift & Inventory */}
						<div className="grid grid-rows-[auto_1fr] gap-2">
							{/* Outfit */}
							<div className="grid grid-cols-[auto_1fr] gap-2 border p-2">
								<span className=" my-auto text-center text-sm">Outfit</span>
								<div className="m-auto grid ">
									<OutfitComponent
										outfit={{
											looktype: player?.looktype,
											lookaddons: player?.lookaddons,
											lookhead: player?.lookhead,
											lookbody: player?.lookbody,
											looklegs: player?.looklegs,
											lookfeet: player?.lookfeet,
										}}
										className="h-[74px] w-[74px]"
									/>
								</div>
							</div>
							{/* Inventory */}
							<div className="grid grid-rows-[auto_1fr] gap-2 border p-2">
								<span className="text-center text-sm">Inventory</span>
								<div className="mx-auto grid grid-cols-3 grid-rows-4 ">
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.NECKLACE)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.HELMET)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.BACKPACK)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.HANDLEFT)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.ARMOR)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.HANDRIGHT)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.RING)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.LEGS)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.AMMO)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="flex h-10 w-10 flex-col justify-center text-center text-[0.65rem]">
										<span>{player.soul}</span>
										<span>Soul</span>
									</div>
									<div className="h-10 w-10 border bg-slate-700">
										<img
											src={getInventoryImage(SLOTS.BOOTS)}
											alt=""
											className="h-full w-full object-cover object-center"
										/>
									</div>
									<div className="flex h-10 w-10 flex-col justify-center text-center text-[0.6rem]">
										<span>{player.cap}</span>
										<span>Cap</span>
									</div>
								</div>
							</div>
						</div>
						{/* Stats & Experience & Skills */}
						<div className="grid grid-rows-3 gap-2 ">
							{/* Stats */}
							<div className="grid grid-rows-2 gap-2 border p-2 text-sm">
								{/* Health */}
								<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
									<span>Health:</span>
									<div className="grid grid-rows-[1fr] gap-1 text-xs">
										<div className="relative flex h-6 flex-row items-center overflow-hidden rounded-lg bg-red-500 text-xs">
											<div
												className="absolute h-full self-start bg-red-600"
												style={{
													width: `${(player.health / player.healthmax) * 100}%`,
												}}
											/>
											<span className="relative z-10 w-full text-center">{`${player.health}/${player.healthmax} (${((player.health / player.healthmax) * 100).toFixed(2)}%)`}</span>
										</div>
									</div>
								</div>
								{/* Mana */}
								<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
									<span>Mana:</span>
									<div className="grid grid-rows-[1fr] gap-1 text-xs">
										<div className="relative flex h-6 flex-row items-center overflow-hidden rounded-lg bg-blue-500 text-xs">
											<div
												className="absolute h-full self-start bg-blue-600"
												style={{
													width: `${(player.mana / player.manamax) * 100}%`,
												}}
											/>
											<span className="relative z-10 w-full text-center">{`${player.mana}/${player.manamax} (${((player.mana / player.manamax) * 100).toFixed(2)}%)`}</span>
										</div>
									</div>
								</div>
							</div>
							{/* Experience */}
							<div className="grid grid-rows-2 gap-2 border p-2 text-sm">
								<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
									<span>Experience:</span>
									<span className="text-center">{`Have ${player.experience} and need ${calculateExperience(player.experience, player.level).expLeft} to Level ${player.level + 1}`}</span>
								</div>
								<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
									<span>Percent:</span>
									<div className="relative flex h-6 flex-row items-center overflow-hidden rounded-lg bg-slate-500 text-xs">
										<div
											className="absolute h-full self-start bg-slate-600"
											style={{
												width: `${(Number(player.experience) / Number(calculateExperience(player.experience, player.level).expLeft + player.experience)) * 100}%`,
											}}
										/>
										<span className="relative z-10 w-full text-center ">{`${player.experience}/${calculateExperience(player.experience, player.level).expLeft + player.experience} (${((Number(player.experience) / Number(calculateExperience(player.experience, player.level).expLeft + player.experience)) * 100).toFixed(2)}%)`}</span>
									</div>
								</div>
							</div>
							{/* Skills */}
							<div className="grid grid-cols-9 items-center justify-center gap-2 border p-2 text-center text-sm">
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/28887.gif"
										alt="level-skill-image"
										className="mx-auto"
									/>
									<span>Level</span>
									<span className="text-xs">{player.level}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/35289.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Magic</span>
									<span className="text-xs">{player.maglevel}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/17828.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Fist</span>
									<span className="text-xs">{player.skill_fist}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/35285.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Sword</span>
									<span className="text-xs">{player.skill_sword}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/35286.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Axe</span>
									<span className="text-xs">{player.skill_axe}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/35287.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Club</span>
									<span className="text-xs">{player.skill_club}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/35288.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Dist</span>
									<span className="text-xs">{player.skill_dist}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/44067.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Def</span>
									<span className="text-xs">{player.skill_shielding}</span>
								</div>
								<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
									<img
										src="/animated-items/3483.gif"
										alt="magic-skill-image"
										className="mx-auto"
									/>
									<span>Fish</span>
									<span className="text-xs">{player.skill_fishing}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col rounded-sm border">
						<div className="flex items-start justify-start bg-background p-2 text-sm">
							Characters
						</div>
						<Table>
							<TableHeader className="pointer-events-none">
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{player.accounts.players.map((player) => (
									<TableRow key={player.id}>
										<TableCell className="w-full">{player.name}</TableCell>
										<TableCell>
											{isOnline(player.id).then((online) => (
												<Badge variant={online ? "success" : "destructive"}>
													{online ? "ONLINE" : "OFFLINE"}
												</Badge>
											))}
										</TableCell>
										<TableCell className="text-right">
											<Button variant={"green"}>
												<Link href={`/characters/${player.name}`}>View</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

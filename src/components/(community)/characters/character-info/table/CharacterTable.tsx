import { formatTibianMoney } from "@/components/(battlepass)/battlepass/lib/utils";
import { RowItem } from "@/components/(community)/characters/character-info/table/RowItem";
import { TableTitle } from "@/components/(community)/characters/character-info/table/TableTitle";
import type { PlayerJoinGuildMembershipAndAccount } from "@/components/(community)/characters/types/character";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fUnixToDate } from "@/utils/functions/formatDate";
import { getVocation } from "@/utils/functions/getVocations";
import type { accounts, guild_ranks, guilds, players } from "@prisma/client";

import Link from "next/link";
import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from "react";

type CharacterInfoProps = {
	player: PlayerJoinGuildMembershipAndAccount | null;
};

export const CharacterTable = ({ player }: CharacterInfoProps) => {
	if (!player) return null;
	const {
		name,
		sex,
		vocation,
		level,
		lastlogin,
		comment,

		accounts: { premdays },
	} = player;

	const hasGuildMembership = player.guild_membership?.guilds;

	return (
		<div className="flex flex-col rounded-sm ">
			{/* Character Information */}
			<TableTitle className="text-sm">Character Information</TableTitle>
			<Table>
				<TableBody>
					<RowItem label="Name" value={name} />
					<RowItem label="Sex" value={sex === 0 ? "Female" : "Male"} />
					<RowItem label="Vocation" value={getVocation(vocation ?? 0)} />
					<RowItem label="Level" value={level} />
					<RowItem
						label="Balance"
						value={player?.balance ? formatTibianMoney(Number(player?.balance), true) : "0"}
						valueClassName="tabular-nums"
					/>
					<RowItem
						shouldShow={!!hasGuildMembership}
						label="Guild"
						value={() => {
							const rankName = player?.guild_membership?.guild_ranks.name;
							const guildName = player?.guild_membership?.guilds.name;
							return (
								<>
									{rankName} of the{" "}
									<Link href={`/guilds/${guildName}`} className="text-blue-500 hover:underline">
										{guildName}
									</Link>
								</>
							);
						}}
					/>
					<RowItem
						label="Last Login"
						value={lastlogin ? fUnixToDate(Number(lastlogin)) : "never"}
					/>
					<RowItem shouldShow={!!comment} label="Comment" value={comment} />
				</TableBody>
			</Table>

			{/* Account Information */}
			<TableTitle className="text-sm">Account Information</TableTitle>
			<Table>
				<TableBody>
					<RowItem label="Created" value={fUnixToDate(Number(player?.accounts.creation))} />
					<RowItem
						label="Status"
						value={
							<Badge variant={premdays ? "vip" : "novip"}>
								{premdays ? "VIP Account" : "Free Account"}
							</Badge>
						}
					/>
				</TableBody>
			</Table>
		</div>
	);

	{
		/**  <div className='flex p-2 items-start justify-start  bg-background text-sm text-red-500'>
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
					</Table> **/
		// biome-ignore lint/complexity/noUselessLoneBlockStatements: <explanation>
	}
};

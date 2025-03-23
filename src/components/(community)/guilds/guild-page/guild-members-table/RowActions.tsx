"use client";

import type {
	KickGuildMemberRequest,
	KickGuildMemberResponse,
	UpdateGuildMemberRankRequest,
	UpdateGuildMemberRankResponse,
	UserGuildStatus,
} from "@/components/(community)/guilds/types/guilds";
import { IconiFy } from "@/components/common/Iconify";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { guild_membership, guild_ranks } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

type RowActionsProps = {
	row: guild_membership;
	disabled: boolean;
	userStatus: UserGuildStatus;
	ranks: guild_ranks[];
};

export const RowActions = ({ row, disabled, userStatus, ranks }: RowActionsProps) => {
	const hasLeaderAccess = userStatus?.level && userStatus?.level >= 2;
	const isOwner = userStatus?.manager === "owner";
	const isRowMyself = row.player_id === userStatus?.player_id;

	async function kickPlayer(guild_id: number, player_id: number) {
		const body: KickGuildMemberRequest = {
			guild_id,
			player_id,
		};
		const res = await fetch(`/api/guilds/manager/${guild_id}/kick/${player_id}`, {
			method: "DELETE",
			body: JSON.stringify(body),
		});
		if (res.ok) {
			const data: KickGuildMemberResponse = await res.json();
			const successMessage = isRowMyself
				? "You have left the guild"
				: `${data?.player_name} has been kicked from the guild`;
			toast.success(successMessage);
		}
		if (res.status === 400) {
			toast.error("Error on kick player");
		}
		if (res.status === 401) {
			toast.error("Unauthorized");
		}
		if (res.status === 403) {
			toast.error("Forbidden");
		}
		if (res.status === 500) {
			toast.error("Internal server error");
		}
	}

	async function updatePlayerRank(guild_id: number, player_id: number, rank_id: number) {
		const body: UpdateGuildMemberRankRequest = {
			rank_id,
		};
		const res = await fetch(`/api/guilds/manager/${guild_id}/player/${player_id}`, {
			method: "PUT",
			body: JSON.stringify(body),
		});
		if (res.ok) {
			const data: UpdateGuildMemberRankResponse = await res.json();
			toast.success(`${data?.player_name} rank has been updated to ${data?.rank_name}`);
		}
		if (res.status === 400) {
			toast.error("Error on update player rank");
		}
		if (res.status === 401) {
			toast.error("Unauthorized");
		}
		if (res.status === 403) {
			toast.error("Forbidden");
		}
		if (res.status === 500) {
			toast.error("Internal server error");
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={disabled}>
				<Button size="iconsm" variant="ghost">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{hasLeaderAccess && !isRowMyself && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Edit rank</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup
								value={row.rank_id.toString()}
								onValueChange={(e) => {
									updatePlayerRank(row.guild_id, row.player_id, +e);
								}}
							>
								{ranks.map((rank) => {
									return (
										<DropdownMenuRadioItem
											key={rank.id}
											value={rank.id.toString()}
											className="hover:text-card-foreground"
										>
											<IconiFy icon={`game-icons:rank-${rank.level}`} className="mr-1.5 h-6 w-6" />
											{rank.name}
										</DropdownMenuRadioItem>
									);
								})}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}
				{hasLeaderAccess && <DropdownMenuItem>Change nick</DropdownMenuItem>}
				{isOwner ||
					(isRowMyself && (
						<DropdownMenuItem onClick={() => kickPlayer(row.guild_id, row.player_id)}>
							Kick
						</DropdownMenuItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

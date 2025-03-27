"use client";

import { API_ROUTES } from "@/app/api/routes";
import type {
	GuildsManagerIdKickPlayerIdDELETERequest,
	GuildsManagerIdKickPlayerIdDELETEResponse,
	GuildsManagerIdPlayerPlayerIdPUTRequest,
	GuildsManagerIdPlayerPlayerIdPUTResponse,
} from "@/app/api/types";
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
import { typedFetch } from "@/utils/typedFetch";
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
		const body: GuildsManagerIdKickPlayerIdDELETERequest = {
			id: guild_id,
			player_id,
		};

		const res = await typedFetch<GuildsManagerIdKickPlayerIdDELETERequest, GuildsManagerIdKickPlayerIdDELETEResponse>(
			API_ROUTES.guilds.manager.id(guild_id).kick.playerId(player_id),
			{
				method: "DELETE",
				body,
			},
		);
		if (res.status === 200) {
			const successMessage = isRowMyself ? "You have left the guild" : `${res.player_name} has been kicked from the guild`;
			toast.success(successMessage);
			return;
		}
		toast.error(res.error ? res.error : "Error on kick player");
	}

	async function updatePlayerRank(guild_id: number, player_id: number, rank_id: number) {
		const res = await typedFetch<GuildsManagerIdPlayerPlayerIdPUTRequest, GuildsManagerIdPlayerPlayerIdPUTResponse>(
			API_ROUTES.guilds.manager.id(guild_id).player.playerId(player_id),
			{
				method: "PUT",
				body: {
					rank_id,
				},
			},
		);

		if (res.status === 200) {
			toast.success(`${res.player_name} rank has been updated to ${res.rank_name}`);
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
										<DropdownMenuRadioItem key={rank.id} value={rank.id.toString()} className="hover:text-card-foreground">
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
				{isOwner || (isRowMyself && <DropdownMenuItem onClick={() => kickPlayer(row.guild_id, row.player_id)}>Kick</DropdownMenuItem>)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

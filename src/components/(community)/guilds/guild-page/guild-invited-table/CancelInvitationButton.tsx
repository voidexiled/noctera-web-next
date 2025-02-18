"use client";

import type {
	DeleteGuildInviteErrorResponse,
	DeleteGuildInviteRequest,
	DeleteGuildInviteResponse,
} from "@/components/(community)/guilds/types/guilds";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CancelInvitationButton({
	guild_id,
	player_id,
}: { guild_id: number; player_id: number }) {
	const router = useRouter();
	const cancelInvitation = async () => {
		const dataRequest: DeleteGuildInviteRequest = {
			guild_id,
			player_id,
		};

		const res = await fetch("/api/guilds/invites/delete", {
			method: "DELETE",
			body: JSON.stringify(dataRequest),
		});

		if (res.ok) {
			const dataResponse: DeleteGuildInviteResponse = await res.json();
			toast.success(`Invitation to ${dataResponse.player_id} was cancelled`);
			router.refresh();
			return;
		}
		if (res.status === 404) {
			const errorResponse: DeleteGuildInviteErrorResponse = await res.json();
			if (errorResponse.message) {
				toast.error(errorResponse.message);
			} else {
				toast.error("An error ocurred while cancelling invitation");
			}
		}
		if (res.status === 500) {
			const errorResponse: DeleteGuildInviteErrorResponse = await res.json();
			if (errorResponse.message) {
				toast.error(errorResponse.message);
			} else {
				toast.error("Server error while cancelling invitation");
			}
		}
	};

	return (
		<Button
			variant="destructive"
			className="whitespace-nowrap"
			onClick={async () => {
				await cancelInvitation();
			}}
		>
			Cancel Invite
		</Button>
	);
}

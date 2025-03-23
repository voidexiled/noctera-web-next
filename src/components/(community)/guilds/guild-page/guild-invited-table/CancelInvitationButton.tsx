"use client";

import { API_ROUTES } from "@/app/api/routes";
import type { GuildsInvitationsDELETERequest, GuildsInvitationsDELETEResponse } from "@/app/api/types";
import type { DeleteGuildInviteErrorResponse, DeleteGuildInviteRequest, DeleteGuildInviteResponse } from "@/components/(community)/guilds/types/guilds";
import { Button } from "@/components/ui/button";
import { typedFetch } from "@/utils/typedFetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CancelInvitationButton({ guild_id, player_id }: { guild_id: number; player_id: number }) {
	const router = useRouter();

	async function CancelInvitation() {
		const res = await typedFetch<GuildsInvitationsDELETERequest, GuildsInvitationsDELETEResponse>(API_ROUTES.guilds.invitations._, {
			method: "DELETE",
			body: {
				guild_id,
				player_id,
			},
		});

		if (res.status === 200) {
			toast.success(`Invitation to ${res.player_name} was cancelled`);
			router.refresh();
			return;
		}

		if (res.error) {
			toast.error(res.error);
		} else {
			toast.error("Something went wrong");
		}
	}

	return (
		<Button
			variant="destructive"
			className="whitespace-nowrap"
			onClick={async () => {
				await CancelInvitation();
			}}
		>
			Cancel Invite
		</Button>
	);
}

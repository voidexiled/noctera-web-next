"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function JoinGuild({
	guild_id,
	player_id,
}: { guild_id: number; player_id: number }) {
	const router = useRouter();

	async function JoinInGuild() {
		const res = await fetch(`/api/guilds/manager/${guild_id}/join/${player_id}`, {
			method: "PATCH",
		});

		if (res.ok) {
			const data: {
				guild_name: string;
			} = await res.json();
			toast({
				title: "Success!",
				description: <div>You have joined to {data.guild_name}.</div>,
				variant: "success",
			});
			router.refresh();
			return;
		}
		toast({
			title: "Error!",
			description: <div>Error on update player rank.</div>,
			variant: "destructive",
		});
	}

	return (
		<Button variant="green" className="whitespace-nowrap" onClick={JoinInGuild}>
			Join Guild
		</Button>
	);
}

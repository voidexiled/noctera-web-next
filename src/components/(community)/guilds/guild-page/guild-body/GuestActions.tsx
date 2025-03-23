import { Button } from "@/components/ui/button";
import Link from "next/link";

export const GuestActions = ({ guild_name }: { guild_name: string }) => {
	return (
		<div className="flex flex-col space-y-2 whitespace-nowrap">
			<Button asChild size="sm">
				<Link href={`/guilds/${guild_name}/wars`}>Guild Wars</Link>
			</Button>
			<Button size="sm">Guild Events</Button>
			<Button size="sm">Guild Offence</Button>
		</div>
	);
};

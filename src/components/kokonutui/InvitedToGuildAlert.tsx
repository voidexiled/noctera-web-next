"use client";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InvitedToGuildAlertProps = {
	characterName: string;
	guildName: string;
	guildLogo: string;
	guildId: number;
	playerId: number;
	invitedAt: number;
};

export default function InvitedToGuildAlert({
	characterName,
	guildName,
	guildLogo,
	guildId,
	playerId,
	invitedAt,
}: InvitedToGuildAlertProps) {
	const router = useRouter();
	const nowDate = new Date();
	const dateDiff = nowDate.getTime() - invitedAt * 1000;
	const dateDiffInMinutes = Math.floor(dateDiff / (1000 * 60));
	const dateDiffInHours = Math.floor(dateDiff / (1000 * 60 * 60));
	const dateDiffInDays = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
	const dateDiffInWeeks = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7));
	const dateDiffInMonths = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 30));
	const dateDiffInYears = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 365));

	async function JoinInGuild() {
		const res = await toast
			.promise(
				fetch(`/api/guilds/manager/${guildId}/join/${playerId}`, {
					method: "PATCH",
				}),
				{
					loading: `${characterName} - Joining to ${guildName}`,
					error: `${characterName} - Error joining to guild`,
					success: `${characterName} - You have joined to ${guildName}`,
				},
			)
			.unwrap();

		if (res.ok) {
			router.refresh();
			return;
		}
	}

	return (
		<div className="mx-auto w-full ">
			<div className="relative border bg-background p-4 shadow-[0_1px_6px_0_rgba(0,0,0,0.02)]">
				<div className="flex items-center gap-4">
					<div className="relative h-10 w-10 shrink-0">
						<Image
							src={`/guilds/${guildLogo}`}
							alt="Sarah Chen"
							sizes="40px"
							fill
							className="rounded-full border bg-card object-cover"
						/>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="font-medium text-sm text-zinc-300">
									Guild Invitation - <span className="text-zinc-100">{characterName}</span>
								</p>
								<p className="mt-0.5 text-[13px] text-zinc-400">
									Hello, you have received an invitation from{" "}
									<Link
										className="font-medium text-blue-300 underline"
										href={`/guilds/${guildName}`}
									>
										{guildName}
									</Link>{" "}
									to join the guild.
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-2">
						{/* <button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-lg p-0 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
						>
							<X className="h-4 w-4" />
						</button> */}
						<button
							type="button"
							onClick={JoinInGuild}
							className={cn(
								"flex items-center justify-center rounded-lg p-3 text-sm",
								"text-emerald-700 hover:bg-emerald-950/50 hover:text-emerald-400",
								"items-center justify-center gap-2 transition-colors",
							)}
						>
							Accept
							<Check className="h-4 w-4" />
						</button>
					</div>
				</div>

				<div className="mt-2 ml-14">
					<p className="text-[12px] text-zinc-400 dark:text-zinc-500">
						Invited {(() => {
							if (dateDiffInYears > 0)
								return `${dateDiffInYears} year${dateDiffInYears > 1 ? "s" : ""}`;
							if (dateDiffInMonths > 0)
								return `${dateDiffInMonths} month${dateDiffInMonths > 1 ? "s" : ""}`;
							if (dateDiffInWeeks > 0)
								return `${dateDiffInWeeks} week${dateDiffInWeeks > 1 ? "s" : ""}`;
							if (dateDiffInDays > 0)
								return `${dateDiffInDays} day${dateDiffInDays > 1 ? "s" : ""}`;
							if (dateDiffInHours > 0)
								return `${dateDiffInHours} hour${dateDiffInHours > 1 ? "s" : ""}`;
							return `${dateDiffInMinutes} minute${dateDiffInMinutes > 1 ? "s" : ""}`;
						})()} ago
					</p>
				</div>
			</div>
		</div>
	);
}

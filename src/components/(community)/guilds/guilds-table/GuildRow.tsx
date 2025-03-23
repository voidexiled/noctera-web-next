import type { GuildsTableType } from "@/components/(community)/guilds/types/guilds";
import { Typography } from "@/components/Typography";
import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";

type GuildRowProps = {
	guild: GuildsTableType;
};
export const GuildRow = ({ guild }: GuildRowProps) => {
	const router = useRouter();
	return (
		<TableRow
			key={guild.id.toString()}
			className="cursor-pointer"
			onClick={() => router.push(`/guilds/${guild.name}`)}
		>
			<TableCell className="min-w-[64px]">
				<Image
					src={`/api/guilds/images/${guild.logo_name}`}
					alt={`${guild.name} logo image`}
					width={64}
					height={64}
					className="min-w-[64px] rounded-md drop-shadow-md"
				/>
			</TableCell>
			<TableCell className="w-full">
				<Typography component="span" variant={"h6"} colorText="primary">
					{guild.name}
				</Typography>
				<Typography
					component="p"
					variant="subtitle1"
					className="line-clamp-2 text-sm"
					colorText="secondary"
				>
					{guild.description.toString()}
				</Typography>
			</TableCell>
			<TableCell className="whitespace-nowrap">
				<Typography component="span" variant="overline">
					{guild.players.name}
				</Typography>
			</TableCell>
		</TableRow>
	);
};

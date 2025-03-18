import { Typography } from "@/components/Typography";
import configLua from "@/hooks/useConfigLua";
import type { guilds, players } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";

const lua = configLua();

type GuildInformationProps = { guild: guilds; ownerName: string };

const GuildDescription = ({ description }: { description: string }) => (
	<Typography variant="body1" component={"blockquote"} className="my-4 font-medium text-sm">
		{description}
	</Typography>
);

const GuildLeader = ({ playerName, guildName }: { playerName: string; guildName: string }) => (
	<Typography variant="body1" className="text-sm">
		<Link href={`/characters/${playerName}`} className="text-blue-500 hover:underline">
			{playerName}
		</Link>{" "}
		is guild leader of {guildName}.
	</Typography>
);

const GuildCreationDetails = ({
	serverName,
	creationDate,
}: { serverName: string; creationDate: number }) => (
	<Typography variant="body1" className="text-foreground/80 text-sm">
		The guild founded on {serverName} in {dayjs.unix(creationDate).format("MMMM D YYYY")}.
	</Typography>
);

const GuildBankBalance = ({ balance }: { balance: number }) => (
	<Typography variant="body1" className="font-bold text-foreground/80 text-sm">
		Guild Bank Account Balance: {balance} Gold
	</Typography>
);

export const GuildInformation = ({ guild, ownerName }: GuildInformationProps) => {
	return (
		<div className="flex w-full flex-col">
			<div className="flex rounded-sm bg-background p-2 text-sm">Guild information</div>
			<div className="p-2">
				<GuildDescription description={guild.description.toString()} />
				<GuildLeader playerName={ownerName} guildName={guild.name} />
				<GuildCreationDetails
					serverName={lua.serverName}
					creationDate={Number(guild.creationdata)}
				/>
				<GuildBankBalance balance={Number(guild.balance)} />
			</div>
		</div>
	);
};

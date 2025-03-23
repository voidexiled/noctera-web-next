import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { battlepass_seasons } from "@prisma/client";
import dayjs from "dayjs";

type LastSeasonCardProps = {
	lastSeason: battlepass_seasons;
};

export const LastSeasonCard = ({ lastSeason }: LastSeasonCardProps) => {
	lastSeason;
	return (
		<Card>
			<CardHeader className="border-b bg-background">
				<CardTitle>
					{lastSeason.season_name} ended at {new Date(lastSeason.date_end).toLocaleString()}
				</CardTitle>
			</CardHeader>
			<CardContent className="">Resumen .. last season</CardContent>
		</Card>
	);
};

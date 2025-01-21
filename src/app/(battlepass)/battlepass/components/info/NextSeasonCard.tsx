import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { battlepass_seasons } from "@prisma/client";

type NextSeasonCardProps = {
	nextSeason: battlepass_seasons;
};

export const NextSeasonCard = ({ nextSeason }: NextSeasonCardProps) => {
	return (
		<Card>
			<CardHeader className="border-b bg-background">
				<CardTitle>
					{nextSeason.season_name} starts at{" "}
					{new Date(nextSeason.date_end).toLocaleString()}!
				</CardTitle>
			</CardHeader>
			<CardContent className="">Teaser new season</CardContent>
		</Card>
	);
};

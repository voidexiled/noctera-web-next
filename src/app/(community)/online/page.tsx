import { getOnlinePlayers } from "@/actions/general/online-players/actions";
import { PlayersOnlineTable } from "@/components/(community)/online/PlayersOnlineTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Online(props: {
	searchParams?: Promise<{ page?: string }>;
}) {
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams?.page) || 1;
	const { players, totalPage } = await getOnlinePlayers({ currentPage });

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Who's Online</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<PlayersOnlineTable players={players} totalPage={totalPage} />
			</CardContent>
		</Card>
	);
}

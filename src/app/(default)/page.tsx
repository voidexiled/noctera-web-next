import LatestNews from "@/components/(news)/last-news/news/LatestNews";
import { getManyPosts } from "@/services/news/PostsService";

export default async function Home() {
	const logs = await getManyPosts({
		where: {
			category: "TICKER",
		},
		take: 5,
		orderBy: {
			createdAt: "desc",
		},
	});

	return <LatestNews logs={logs} />;
}

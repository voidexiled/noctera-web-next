import { PostList } from "@/components/(admin)/posts/PostList";
import type { PostRow } from "@/components/(admin)/posts/types/posts";
import { DataTable } from "@/components/common/data-table/data-table";
import { GetAccountUnique } from "@/services/accounts/AccountsService";
import { getManyPosts } from "@/services/news/PostsService";

export default async function PostListPage() {
	const posts = await getManyPosts({
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedPosts: PostRow[] = await Promise.all(
		posts.map(async (post) => {
			const author_name = await GetAccountUnique({
				where: {
					id: post.account_id,
				},
				select: {
					players: {
						select: {
							name: true,
						},
					},
				},
			});
			const postRow: PostRow = {
				...post,
				author_name: author_name.players[0].name,
			};

			return postRow;
		}),
	);

	return (
		<div>
			<PostList posts={formattedPosts} />
		</div>
	);
}

import type { newsType } from "@/components/(news)/types/news";
import { Typography } from "@/components/Typography";
import type { posts } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect } from "react";

export const NewsPostItem = ({ post }: { post: posts }) => {
	return (
		<article>
			<header className="flex items-center justify-between space-x-2 rounded-sm bg-background p-2">
				<div className="flex flex-row items-center gap-2">
					<Typography variant="h6" className="leading-3">
						{post.title}
					</Typography>
				</div>
				<time className="flex flex-col items-center font-normal text-gray-400 text-xs">
					{dayjs(post.createdAt).format("MMM d YYYY")}
				</time>
			</header>
			<article
				id="latest-content"
				className=" p-2"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>
		</article>
	);
};

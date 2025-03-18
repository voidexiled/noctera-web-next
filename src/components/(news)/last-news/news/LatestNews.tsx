"use client";

import { LogsList } from "@/components/(news)/last-news/logs/LogsList";
import { NewsPostItem } from "@/components/(news)/last-news/news/NewsPostItem";
import type { newsType } from "@/components/(news)/types/news";
import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getManyPosts } from "@/services/news/PostsService";
import type { posts } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LatestNews({ logs }: { logs: posts[] }) {
	const [page, setPage] = useState(1);
	const [news, setNews] = useState<newsType>();

	const [ref, inView] = useInView();

	const getNews = async (page: number) => {
		try {
			const response = await fetch(`/api/news/blog?page=${page}`);
			if (response.ok) {
				const data = await response.json();
				if (page === 1) {
					setNews({
						posts: data.posts,
						totalPage: data.totalPages,
					});
				} else {
					setNews((old: newsType | undefined) => ({
						posts: [...(old?.posts || []), ...data.posts],
						totalPage: data.totalPages,
					}));
				}
			}
		} catch (e) {
			const error: Error = e as Error;
			console.log("Error:", error);
		}
	};

	useEffect(() => {
		getNews(page);
	}, [page]);

	useEffect(() => {
		if (inView) {
			setPage(page + 1);
		}
	}, [inView]);

	return (
		<>
			<LogsList logs={logs} />
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Latest News</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{news?.posts.map((post, index) => {
						return (
							<NewsPostItem
								ref={ref}
								key={post.id}
								post={post}
								className={cn(index !== news?.posts.length - 1 && "border-b")}
							/>
						);
					})}
				</CardContent>
			</Card>
		</>
	);
}

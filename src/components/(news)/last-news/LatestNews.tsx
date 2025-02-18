"use client";

import { NewsPostItem } from "@/components/(news)/last-news/NewsPostItem";
import type { newsType } from "@/components/(news)/types/news";
import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LastNews() {
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
		} catch (error) {
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
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Last News</CardTitle>
			</CardHeader>
			<CardContent>
				{news?.posts.map((post) => {
					return <NewsPostItem key={post.id} post={post} />;
				})}
			</CardContent>
		</Card>
	);
}

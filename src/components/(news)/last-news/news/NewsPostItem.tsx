"use client";

import type { newsType } from "@/components/(news)/types/news";
import { Typography } from "@/components/Typography";
import { cn } from "@/lib/utils";

import type { posts } from "@prisma/client";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { type Ref, useEffect, useState } from "react";

export const NewsPostItem = ({
	post,
	className,
	ref,
}: { post: posts; className?: string; ref: Ref<HTMLElement> }) => {
	// const [serializedState, setSerializedState] = useState<SerializedEditorState>(
	// 	JSON.parse(post.content),
	// );

	// useEffect(() => {
	// 	setSerializedState(JSON.parse(post.content));
	// 	console.log(serializedState);
	// }, [post.content]);

	return (
		<article className={cn(className)} ref={ref}>
			<header className="flex flex-col gap-1 bg-background px-4 py-2">
				<h1 className="text-pretty font-bold text-2xl">{post.title}</h1>
				<div className="flex flex-row items-center gap-1 text-foreground/70 text-sm">
					<CalendarIcon className="size-3.5" />

					<span className="align-middle font-mono">
						{dayjs(post.createdAt).format("MMM d YYYY HH:mm")}
					</span>
				</div>
			</header>
			{/* <header className="grid grid-cols-[1fr_auto] gap-1 p-2">
				<h2 className="text-pretty text-lg">{post.title}</h2>

				<div className="flex h-fit items-center">
					<span className=" truncate text-nowrap font-normal text-gray-400 text-xs">
						{dayjs(post.createdAt).format("MMM d YYYY")}
					</span>
				</div>
			</header> */}
			<main
				className="no-tailwindcss-base bg-card px-4 py-2" // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>
			{/* <LexicalRenderer serializedState={post.content} /> */}
		</article>
	);
};

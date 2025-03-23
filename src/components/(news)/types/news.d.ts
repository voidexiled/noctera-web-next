import type { POST_TYPE, posts } from "@prisma/client";

export type newsType = {
	posts: posts[];
	totalPage: number;
};

export type LogsInfoType = {
	[key in POST_TYPE]: {
		default: string;
		small: string;
	};
};

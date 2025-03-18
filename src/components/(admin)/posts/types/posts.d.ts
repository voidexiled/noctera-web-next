import type { posts } from "@prisma/client";

export type PostRow = posts & {
	author_name: string;
};

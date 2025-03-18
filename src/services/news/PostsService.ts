import { prisma } from "@/lib/prisma";
import type { Prisma, posts } from "@prisma/client";

export async function getManyPosts<T extends Prisma.postsFindManyArgs>(
	args: T,
): Promise<Prisma.postsGetPayload<T>[]> {
	try {
		const posts = await prisma.posts.findMany(args);
		return posts as Prisma.postsGetPayload<T>[];
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		throw error;
	}
}

export async function createPost(args: Prisma.postsCreateInput) {
	try {
		const post = await prisma.posts.create({
			data: args,
		});
		return post;
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		throw error;
	}
}

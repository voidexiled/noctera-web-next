import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";
import { NextResponse } from "next/server";

enum types {
	blog = "BLOG",
	ticker = "TICKER",
	roadmap = "ROADMAP",
}
type Params = Promise<{ type: types }>;

export async function GET(request: Request, segmentData: { params: Params }) {
	try {
		const params = await segmentData.params;
		const url = new URL(request.url);

		const page = Number.parseInt(url.searchParams.get("page") || "1");
		const postsPerPage = Number.parseInt(url.searchParams.get("limit") || "3");
		const skip = (page - 1) * postsPerPage;

		const posts = await prisma.posts.findMany({
			where: { category: params.type.toUpperCase() as types, published: true },
			select: {
				title: true,
				content: true,
				slug: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
			skip,
			take: postsPerPage,
		});

		const totalPosts = await prisma.posts.count({
			where: { category: params.type.toUpperCase() as types },
		});

		const totalPages = Math.ceil(totalPosts / postsPerPage);

		return NextResponse.json({
			posts: convertBigIntsToNumbers(posts),
			currentPage: page,
			totalPages,
		});
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

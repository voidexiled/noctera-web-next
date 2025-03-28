import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = Promise<{ category: string }>;

const List = async (request: Request, segmentData: { params: Params }) => {
	try {
		const params = await segmentData.params;
		const session = await getServerSession(authOptions);
		if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const products = await prisma.products.findMany({
			where: { category_id: +params.category },
		});
		return NextResponse.json({ products });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
};

export { List as GET };

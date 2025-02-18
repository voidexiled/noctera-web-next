import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

const List = async (request: NextRequest, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const { id } = await params;
		const product = await prisma.products.findFirst({
			where: { id: +id },
			select: {
				title: true,
				price: true,
				currency: true,
				content: true,
			},
		});
		return NextResponse.json(product);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
};

export { List as GET };

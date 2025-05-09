import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
type Params = Promise<{ id: string }>;

const Get = async (req: Request, { params }: { params: Params }) => {
	const session = await getServerSession(authOptions);
	if (!session?.user || session.user.role !== "admin")
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const productId = (await params).id;
	const acc = await prisma.accounts.findUnique({
		where: { id: Number(session?.user?.id) },
	});
	if (!acc) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const product = prisma.products.findUnique({ where: { id: +productId } });
	if (!product) return NextResponse.json({ message: "Product not fount" }, { status: 400 });

	return NextResponse.json({ product });
};

const Delete = async (req: Request, { params }: { params: Params }) => {
	const session = await getServerSession(authOptions);
	if (!session?.user || session.user.role !== "admin")
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const productId = (await params).id;
	const acc = await prisma.accounts.findUnique({
		where: { id: Number(session?.user?.id) },
	});
	if (!acc) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const findProduct = prisma.products.findUnique({ where: { id: +productId } });
	if (!findProduct) return NextResponse.json({ message: "Product not fount" }, { status: 400 });
	await prisma.products.delete({ where: { id: +productId } });

	return NextResponse.json({});
};

const Update = async (req: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || session.user.role !== "admin")
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const productId = (await params).id;
		const acc = await prisma.accounts.findUnique({
			where: { id: Number(session?.user?.id) },
		});
		if (!acc) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const data = await req.formData();
		//const file: File | null = data.get('img') as unknown as File
		if (
			!data.get("img") ||
			!data.get("title") ||
			!data.get("price") ||
			!data.get("quantity") ||
			!data.get("category") ||
			!data.get("currency")
		) {
			throw new Error("No file uploaded");
		}
		//const bytes = await file.arrayBuffer()
		//const buffer = Buffer.from(bytes)
		//const fileName = `${randomUUID()}-${file.name}`

		//await writeFile(`./public/shop/${fileName}`, buffer)

		await prisma.products.update({
			where: { id: +productId },
			data: {
				title: data.get("title") as string,
				price: data.get("price") as string,
				currency: data.get("currency") as string,
				quantity: Number(data.get("quantity")),
				category_id: Number(data.get("category")),
				content: data.get("title") as string,
				img_url: data.get("img") as string,
			},
		});
		return NextResponse.json({}, { status: 201 });
	} catch (error) {
		NextResponse.json({ error });
	}
};

export { Get as GET, Delete as DELETE, Update as PUT };

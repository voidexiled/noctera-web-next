"use server";

import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
	img: z.custom<File>((file) => file instanceof File, "Required"),
	// img: z.string(),
	title: z.string(),
	price: z.string(),
	category: z.string(),
	currency: z.string(),
	quantity: z.string(),
});

export async function createProduct(formData: FormData) {
	const { img } = ProductSchema.parse({
		img: formData.get("img") as unknown as File,
		title: formData.get("title") as string,
		price: formData.get("price") as string,
		category: formData.get("category") as string,
		currency: formData.get("currency") as string,
		quantity: formData.get("quantity") as string,
	});
	const file: File | null = formData.get("img") as unknown as File;

	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let prodImgName;
	if (typeof file !== "object") {
		prodImgName = undefined;
	} else {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const fileName = `${randomUUID()}-${file.name}`;
		const path = join("public", "shop", fileName);
		await writeFile(path, buffer);
		prodImgName = fileName;
	}
	const prod = await prisma.products.create({
		data: {
			title: formData.get("title") as string,
			price: formData.get("price") as string,
			quantity: Number(formData.get("quantity")),
			category_id: Number(formData.get("category")),
			content: formData.get("title") as string,
			img_url: prodImgName,
			currency: formData.get("currency") as string,
		},
	});

	if (!prod) return false;
	revalidatePath("/account-manager/admin/shop/products");
	return true;
}

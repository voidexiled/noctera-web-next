import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type GetShopProductsProps = {
	select?: Prisma.productsSelect;
	orderBy?: Prisma.Enumerable<Prisma.productsOrderByWithRelationInput>;
	where?: Prisma.productsWhereInput;
	take?: number;
	skip?: number;
};

export async function getShopProducts({ select, orderBy, take, skip }: GetShopProductsProps) {
	const products = await prisma.products.findMany({
		select,
		orderBy,
		take,
		skip,
	});

	return products;
}

type GetShopProductCategoriesProps = {
	select?: Prisma.products_categoriesSelect;
	orderBy?: Prisma.Enumerable<Prisma.products_categoriesOrderByWithRelationInput>;
	where?: Prisma.products_categoriesWhereInput;
	take?: number;
	skip?: number;
};

export async function getShopProductCategories({
	select,
	orderBy,
	take,
	skip,
}: GetShopProductCategoriesProps) {
	const productCategories = await prisma.products_categories.findMany({
		select,
		orderBy,
		take,
		skip,
	});

	return productCategories;
}

export async function getShopPaymentMethods() {
	return ["stripe"];
}

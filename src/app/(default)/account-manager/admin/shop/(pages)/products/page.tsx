import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import CreateProduct from "./components/create-product";
import TableAction from "./components/table-actions";
async function getProducts() {
	const products = await prisma.products.findMany({
		include: {
			Categories: {
				select: { name: true },
			},
		},
	});
	return { products };
}
async function getCategories() {
	const categories = await prisma.products_categories.findMany();
	return { categories };
}

export default async function AdminProducts() {
	const { products } = await getProducts();
	const { categories } = await getCategories();
	return (
		<>
			<div className="flex items-center justify-between space-y-2">
				<h2 className="font-bold text-3xl tracking-tight">Products</h2>
				<div className="flex items-center space-x-2">
					<CreateProduct categories={categories} />
				</div>
			</div>

			<div className="rounded-sm border">
				<div className="flex items-center justify-end border-b bg-background p-2 text-sm">
					<div className="flex flex-row items-center gap-2">
						<Button
							variant={"outline"}
							className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m14 7l-5 5m0 0l5 5"
								/>
							</svg>
						</Button>
						<span>0 of 0</span>
						<Button
							variant={"outline"}
							className="h-[24px] w-[24px] bg-white p-0 hover:bg-slate-50"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
								<rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m10 17l5-5l-5-5"
								/>
							</svg>
						</Button>
					</div>
				</div>

				<Table>
					<TableHeader className="pointer-events-none">
						<TableRow>
							<TableHead className="w-[100px]" />
							<TableHead className="" />
							<TableHead className="w-[100px] text-center" />
							<TableHead className="w-[20px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product) => (
							<TableRow key={product.id}>
								<TableCell className="w-[100px]">
									<Image
										src={`/shop/${product.img_url}`}
										alt="Picture of the product"
										width={150}
										height={150}
										style={{
											width: "auto",
											height: "auto",
										}}
									/>
								</TableCell>
								<TableCell className="">{product.title}</TableCell>
								<TableCell className="w-[140px] text-center">
									<Badge variant={"outline"} className="w-full justify-center">
										{product.Categories?.name}
									</Badge>
								</TableCell>
								<TableCell className="w-[20px]">
									<TableAction
										product={{
											id: product.id,
											category_id: product.category_id,
											price: product.price,
											currency: product.currency!,
											quantity: product.quantity,
											title: product.title,
											img: `/shop/${product.img_url}`,
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

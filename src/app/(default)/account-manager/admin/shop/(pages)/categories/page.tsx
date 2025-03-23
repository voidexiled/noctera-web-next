import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { products_categories } from "@prisma/client";

async function getCategories() {}
export default function AdminCategories() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const categories: any[] = [];
	return (
		<>
			<div className="rounded-sm border">
				<div className="flex items-center justify-between border-b bg-background p-2 text-sm">
					Categories Manager
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
					<TableBody>
						{categories.map((category) => (
							<TableRow key={category.id}>
								<TableCell>{category.title}</TableCell>
								<TableCell>cell</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

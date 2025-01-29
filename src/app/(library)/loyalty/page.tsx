import TableEmptyState from "@/components/table-empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function LoyaltyPage() {
	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Loyalty</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 p-2">
					<div className="flex flex-col rounded-sm border">
						{/* <div className='flex p-2 items-center justify-between bg-background text-sm'>
              Loyalty
            </div> */}
						<TableEmptyState />
					</div>
				</CardContent>
			</Card>
		</>
	);
}

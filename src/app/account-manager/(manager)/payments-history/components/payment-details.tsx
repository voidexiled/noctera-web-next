"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import dayjs from "dayjs";
import { useState } from "react";
import { detailsOrder } from "./actions";

export default function PaymentDetails({ orderID }: { orderID: string }) {
	const [showDialog, setShowDialog] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [response, setResponse] = useState<any>();
	return (
		<>
			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<Button
					className="line-clamp-1 h-auto w-full px-2 py-1 text-left text-xs"
					variant={"ghost"}
					onClick={async () => {
						const { jsonResponse, httpStatusCode } =
							await detailsOrder(orderID);
						if (httpStatusCode === 200) {
							setResponse(jsonResponse);
							setShowDialog(true);
						}
					}}
				>
					Details
				</Button>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>Order Details</DialogTitle>
					</DialogHeader>
					<div className="rounded border">
						<div className="flex items-center justify-between border-b bg-background p-2 text-sm">
							Paypal Information
						</div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="w-[120px] font-medium text-xs">
										OrderID:
									</TableCell>
									<TableCell className="font-medium text-xs">
										{orderID}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="w-[120px] font-medium text-xs">
										Created:
									</TableCell>
									<TableCell className="font-medium text-xs">
										{dayjs(response?.created_time).format("D/MM/YYYY HH:mm")}
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell className="font-medium text-xs">
										Paypal Status:
									</TableCell>
									<TableCell className="font-medium text-xs">
										{response?.status}
									</TableCell>
								</TableRow>

								{response?.payer && (
									<TableRow>
										<TableCell className="align-top font-medium text-xs">
											Payer:
										</TableCell>
										<TableCell className="font-medium text-xs">
											<ul>
												<li>
													<b>Email: </b>
													{response?.payer?.email_address}
												</li>
												<li>
													<b>Name: </b>
													{response?.payer?.name.given_name}{" "}
													{response?.payer?.name.surname}
												</li>
											</ul>
										</TableCell>
									</TableRow>
								)}

								{response?.purchase_units?.map(
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
									(purchase: any, index: number) => {
										return (
											<>
												<TableRow key={index.toString()}>
													<TableCell className="w-[120px] font-medium text-xs">
														Currency:
													</TableCell>
													<TableCell className="text-xs">
														{purchase?.amount?.currency_code}
													</TableCell>
												</TableRow>
												{/* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
												<TableRow key={index}>
													<TableCell className="w-[120px] font-medium text-xs">
														Value:
													</TableCell>
													<TableCell className="text-xs">
														{purchase?.amount?.value}
													</TableCell>
												</TableRow>
											</>
										);
									},
								)}
							</TableBody>
						</Table>
					</div>

					<DialogFooter className="sm:justify-end">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

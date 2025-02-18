import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CancelOrderButton } from "@/app/account-manager/(manager)/payments-history/components/CancelOrderButton";
import { CompleteOrderButton } from "@/app/account-manager/(manager)/payments-history/components/CompleteOrderButton";
import PaymentDetails from "./components/payment-details";

async function getPaymentsHistory(id: number) {
	const account = await prisma.orders.findMany({
		where: { account_id: Number(id) },
		take: 10,
		orderBy: { id: "desc" },
	});
	return account;
}

const STATUS_TYPE: {
	[key: string]:
		| "error"
		| "default"
		| "info"
		| "destructive"
		| "outline"
		| "secondary"
		| "success"
		| "warning"
		| null
		| undefined;
} = {
	DELIVERED: "success",
	PENDING: "info",
	CANCELED: "destructive",
};

export default async function PaymentsHistory() {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) redirect("/");

	const history = await getPaymentsHistory(Number(user?.id));
	if (!history) redirect("/");

	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Payments History</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 p-2">
					<div className="flex flex-col rounded-sm border">
						<Table>
							<TableHeader className="pointer-events-none">
								<TableRow>
									<TableHead className="">Order ID</TableHead>
									{/* <TableHead className="">Payment ID</TableHead> */}
									<TableHead className="w-full">Description</TableHead>
									<TableHead className="whitespace-nowrap">Order Create</TableHead>
									<TableHead className="whitespace-nowrap">Provider</TableHead>
									<TableHead className="w-[100px] text-center">Status</TableHead>
									<TableHead className="w-[100px] text-center">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{history.map((order, i) => (
									<TableRow key={i.toString()}>
										<TableCell className="font-medium text-xs">{order.orderID}</TableCell>
										{/* <TableCell className="text-xs font-medium">{order.paymentID}</TableCell> */}
										<TableCell>{order.description}</TableCell>
										<TableCell>{dayjs(order.createdAt).format("DD/MM/YYYY")}</TableCell>
										<TableCell className="text-center">
											<Image src="/payments/stripe.webp" width={42} height={42} alt="Stripe" />
										</TableCell>
										<TableCell className="text-center">
											<Badge variant={STATUS_TYPE[order.status]} className="w-full justify-center">
												{order.status}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0" size={"sm"}>
														<span className="sr-only">Open menu</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 256 256"
														>
															<path
																fill="currentColor"
																d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16Zm-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16Z"
															/>
														</svg>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="space-y-1">
													<DropdownMenuItem>View details</DropdownMenuItem>
													{order.status === ORDER_STATUS.PROCESSING && (
														<DropdownMenuItem asChild>
															<CompleteOrderButton
																paymentIntentId={order.orderID}
																paymentIntentClientSecret={order.paymentClientSecret}
															/>
														</DropdownMenuItem>
													)}
													{order.status === ORDER_STATUS.PENDING && (
														<DropdownMenuItem asChild>
															<CancelOrderButton paymentIntentId={order.orderID} />
														</DropdownMenuItem>
													)}

													{/* <DropdownMenuItem asChild>
														<PaymentDetails orderID={order.orderID} />
													</DropdownMenuItem>
													{order.status === "PENDING" && (
														<DropdownMenuItem>
															<CancelOrderButton order={order.orderID} />
														</DropdownMenuItem>
													)} */}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className="flex justify-end">
						<Button asChild>
							<Link href={"/account-manager/"}>Back</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

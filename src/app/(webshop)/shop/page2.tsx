// "use client";
// import { Typography } from "@/components/Typography";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { IconiFy } from "@/components/common/Iconify";
// import { FormProvider, RHFSelect } from "@/components/common/hook-form";
// import RHFCheckbox from "@/components/common/hook-form/RHFCheckbox";
// import {
// 	RHFRadioGroupItemShop,
// 	RHFRadioGroupPayments,
// } from "@/components/common/hook-form/RHFRadioGroup";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { boolean, z } from "zod";

// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";

// import { Checkout } from "@/app/(webshop)/shop/components/Checkout";
// import type { ShopProduct } from "@/app/(webshop)/shop/shop";
// import { CATEGORIES } from "@/app/(webshop)/shop/utils/consts";
// import { countries } from "@/app/account-manager/(manager)/components/data/countries";
// import type * as Prisma from "@prisma/client";
// import {
// 	CheckoutProvider,
// 	Elements,
// 	PaymentElement,
// 	useCheckout,
// 	useElements,
// 	useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { toast } from "sonner";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export default function PremiumHistory() {
// 	const searchParams = useSearchParams();
// 	const route = useRouter();

// 	const { data: session, status } = useSession();

// 	const payments = [{ title: "PayPal", value: "paypal", img_url: "string" }];

// 	//const [categories, setCategories] = useState<Prisma.products_categories[]>([]);
// 	const [products, setProducts] = useState<ShopProduct[]>([]);

// 	const [activeStep, setActiveStep] = useState(0);

// 	const handleNext = () => {
// 		setActiveStep((prevActiveStep) => prevActiveStep + 1);
// 	};

// 	const handleBack = () => {
// 		setActiveStep((prevActiveStep) => prevActiveStep - 1);
// 	};

// 	const ShopStepFormSchema = z.object({
// 		product: z.string(),
// 		payment: z.string(),
// 		category: z.enum(["coins_transferable", "premdays"]),
// 		terms: boolean().default(false),
// 	});

// 	type shopStepFormValues = z.infer<typeof ShopStepFormSchema>;

// 	const methods = useForm<shopStepFormValues>({
// 		resolver: zodResolver(ShopStepFormSchema),
// 		defaultValues: {
// 			category: "coins_transferable",
// 		},
// 	});

// 	const {
// 		reset,
// 		handleSubmit,
// 		watch,
// 		setValue,
// 		formState: { isSubmitting },
// 	} = methods;
// 	const values = watch();

// 	const handleReset = () => {
// 		setActiveStep(0);
// 		reset();
// 	};

// 	const selectedProduct = products?.filter((p) => p.id.toString() === watch("product"))[0];

// 	// async function getCategories() {
// 	//   const req = await fetch('/api/shop/categories')
// 	//   if (req.ok) {
// 	//     const body = await req.json()
// 	//     setCategories(body)
// 	//   }
// 	// }

// 	const GetProducts = useCallback(async (categoryId: string) => {
// 		try {
// 			const req = await fetch(`/api/shop/product/${categoryId}`);
// 			if (!req.ok) throw new Error("Failed to fetch");

// 			const data: { products: ShopProduct[] } = await req.json();
// 			setProducts(
// 				data.products.map((p) => ({
// 					...p,
// 					img_url: `/shop/${p.img_url}`,
// 				})),
// 			);
// 		} catch (error) {
// 			toast.error("Error loading products");
// 		}
// 	}, []);
// 	// useEffect(() => {
// 	//   setValue('category', 'premdays')
// 	// }, [])

// 	useEffect(() => {
// 		const categoryId =
// 			values.category === CATEGORIES.PREMDAYS.value ? CATEGORIES.PREMDAYS.id : CATEGORIES.COINS.id;
// 		GetProducts(categoryId);

// 		// GetProducts(values.category.toString())
// 	}, [values.category]);

// 	useEffect(() => {
// 		if (searchParams.get("success") === "true" && searchParams.get("payment_intent")) {
// 			toast.success("Order completed successfully");
// 		}
// 	}, []);

// 	function convertToSubCurrency(price: number): number {
// 		return price * 100;
// 	}

// 	return (
// 		<>
// 			<Card>
// 				<CardHeader className="border-b bg-background">
// 					<CardTitle>Buy Coins</CardTitle>
// 				</CardHeader>
// 				<CardContent className="space-y-2 p-2">
// 					<FormProvider methods={methods} id="form">
// 						<div className="rounded-sm border">
// 							<div className="`transition-all transform duration-300 ease-in-out">
// 								<div className="flex items-center justify-between border-b bg-background p-2 text-sm ">
// 									<div className="flex items-center gap-2">
// 										<IconiFy icon={"healthicons:money-bag-outline"} />
// 										Select Product
// 									</div>
// 									{activeStep > 0 && (
// 										<IconiFy icon={"ph:check-circle"} className="text-green-600" />
// 									)}
// 								</div>
// 								{activeStep === 0 && (
// 									<>
// 										<div className="p-2 pb-0">
// 											<RHFSelect
// 												name="Category"
// 												LabelOption={"label"}
// 												keyValue={"value"}
// 												defaultValue={watch("category")}
// 												options={[
// 													// { label: 'Transferable Coins', value: 'coins_transferable' },
// 													// { label: "Vip days", value: "premdays" },
// 													{
// 														label: "Noctera coins",
// 														value: "coins_transferable",
// 													},
// 												]}
// 												// options={
// 												//   categories.map((c) => ({ label: c.name, value: c.id.toString() }))
// 												// }
// 												onValueChange={(v) => {
// 													reset();
// 													setValue("category", v as "coins_transferable" | "premdays");
// 													// if (v === 'coins') {
// 													//   setProducts(PRODUCTS[0])
// 													// } else if (v === 'premdays') {
// 													//   setProducts(PRODUCTS[1])
// 													// }
// 												}}
// 											/>
// 										</div>

// 										<RHFRadioGroupItemShop
// 											name="product"
// 											options={products
// 												.map((product) => ({
// 													...product,
// 													price: product.price.toString(),
// 												}))
// 												.toSorted((a, b) => a.quantity! - b.quantity!)}
// 											defaultValue={watch("product")}
// 										/>

// 										<div className="m-2 rounded-sm border p-2 text-center">
// 											<Typography variant={"body2"} component={"p"}>
// 												* Please note that the prices may vary depending on the current exchanger
// 												rate.
// 											</Typography>
// 											<Typography variant={"body2"} component={"p"}>
// 												Different prices may apply depending on you selected payment method.
// 											</Typography>
// 										</div>
// 									</>
// 								)}
// 							</div>

// 							<div className="flex items-center justify-between border-t border-b bg-background p-2 text-sm">
// 								<div className="flex items-center gap-2">
// 									<IconiFy icon={"fluent:payment-28-regular"} />
// 									Select payment provider
// 								</div>
// 								{activeStep > 1 && <IconiFy icon={"ph:check-circle"} className="text-green-600" />}
// 							</div>

// 							{activeStep === 1 && <RHFRadioGroupPayments name="payment" options={payments} />}
// 							<div className="flex items-center justify-between border-t border-b bg-background p-2 text-sm">
// 								<div className="flex items-center gap-2">Checkout</div>
// 							</div>
// 							{activeStep === 2 && (
// 								<div>
// 									<Table>
// 										<TableBody>
// 											<TableRow>
// 												<TableCell className="w-[130px]">Product</TableCell>
// 												<TableCell>
// 													<strong>{selectedProduct?.title}</strong>
// 												</TableCell>
// 											</TableRow>
// 											<TableRow>
// 												<TableCell>Price</TableCell>
// 												<TableCell>
// 													<strong>
// 														{selectedProduct.price} {selectedProduct.currency}
// 													</strong>
// 												</TableCell>
// 											</TableRow>
// 											<TableRow>
// 												<TableCell>Payment Method</TableCell>
// 												<TableCell>
// 													<strong className="">
// 														{payments?.filter((p) => p.value === watch("payment"))[0].title}
// 													</strong>
// 												</TableCell>
// 											</TableRow>
// 											<TableRow>
// 												<TableCell>Country</TableCell>
// 												<TableCell>
// 													<strong>MX</strong>
// 												</TableCell>
// 											</TableRow>
// 											<TableRow>
// 												<TableCell>E-Mail Address</TableCell>
// 												<TableCell>
// 													<strong>{session?.user.email}</strong>
// 												</TableCell>
// 											</TableRow>
// 										</TableBody>
// 									</Table>
// 								</div>
// 							)}
// 						</div>

// 						<div className="flex justify-end gap-2">
// 							<div className="flex justify-end gap-2">
// 								<Button
// 									disabled={activeStep === 0}
// 									onClick={activeStep === 2 ? handleReset : handleBack}
// 									variant={"outline"}
// 								>
// 									{activeStep === 2 ? "Reset" : "Cancel"}
// 								</Button>
// 								{/* ELEMENTS */}
// 								{/* support for stripe */}
// 								{/* case 19994586 */}
// 								{/* TODO: Re-do all the page */}
// 								{/* TODO: Support multiple currencies (CAD, MXN, COP, ARS, EUR, CLP, BRL)*/}
// 								{/* TODO: Support multiple payment methods (mx: OXXO, USA: paypal)*/}
// 								{/* TODO: Support for PayPal too*/}
// 								{/* TODO:  */}
// 								{/* todo: DO NOT USE DIALOG FOR CHECKOUT, USE OTHER WAY */}
// 								{activeStep === 2 ? (
// 									<Elements
// 										stripe={stripePromise}
// 										options={{
// 											mode: "payment",
// 											amount: 2000,
// 											currency: "mxn",
// 											appearance: {
// 												theme: "night",
// 												labels: "floating",
// 												variables: {},
// 											},
// 										}}
// 									>
// 										<Checkout
// 											selectedProduct={selectedProduct}
// 											session={session}
// 											handleResetAction={handleReset}
// 										/>
// 									</Elements>
// 								) : activeStep === 0 ? (
// 									<Button variant="green" disabled={!watch("product")} onClick={handleNext}>
// 										Continue
// 									</Button>
// 								) : (
// 									<Button variant="green" disabled={!watch("payment")} onClick={handleNext}>
// 										Continue
// 									</Button>
// 								)}
// 							</div>
// 						</div>
// 					</FormProvider>
// 				</CardContent>
// 			</Card>
// 		</>
// 	);
// }

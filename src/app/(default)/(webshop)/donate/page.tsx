import { ShopContextProvider } from "@/app/(default)/(webshop)/donate/components/ShopContext";
import ShopForm from "@/app/(default)/(webshop)/donate/components/ShopForm";
import { StepFormContextProvider } from "@/app/(default)/(webshop)/donate/components/StepFormContext";
import {
	getShopPaymentMethods,
	getShopProductCategories,
	getShopProducts,
} from "@/app/(default)/(webshop)/donate/services/ShopService";
import Loading from "@/app/(default)/loading";
import { countries } from "@/components/(account-manager)/(manager)/data/countries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getAccountUnique } from "@/services/accounts/AccountsService";
import { getExchangeRate } from "@/services/common/ExchangeRatesService";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { Suspense } from "react";

export default async function ShopPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user.id) return null;

	let country = "";
	let currency_code = "";
	const userAccount = await getAccountUnique({
		where: { id: +session.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			country: true,
			coins_transferable: true,
			coins: true,
			premdays: true,
			phone: true,
		},
	}).then((account) => {
		country = (account?.country as string).toLowerCase();
		currency_code = countries.find((c) => c.value.toLowerCase() === country.toLowerCase())
			?.code as string;
		return account;
	});
	console.log(userAccount);
	console.log(country);
	console.log(currency_code);

	const productCategories = await getShopProductCategories({});

	const products = await getShopProducts({
		orderBy: {
			price: "asc",
		},
	});
	const paymentMethods = await getShopPaymentMethods();

	const exchangeRate = await getExchangeRate({
		where: {
			base_currency: "usd",
			target_currency: currency_code,
		},
		select: {
			rate: true,
		},
	});
	const formatedexchangeRate = exchangeRate
		? {
				rate: +exchangeRate.rate,
				base_currency: "usd",
				target_currency: currency_code,
				updatedAt: exchangeRate.updatedAt,
			}
		: null;

	return (
		<ShopContextProvider products={products} productCategories={productCategories}>
			<StepFormContextProvider>
				<Card>
					<CardHeader className="border-b bg-background">
						<CardTitle>Web Shop</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Suspense fallback={<Loading />}>
							<ShopForm
								exchangeRate={formatedexchangeRate}
								userAccount={userAccount}
								products={products}
								productCategories={productCategories}
								paymentMethods={paymentMethods}
							/>
						</Suspense>
					</CardContent>
				</Card>
			</StepFormContextProvider>
		</ShopContextProvider>
	);
}

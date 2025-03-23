import CurrenciesActionsSection from "@/app/(default)/account-manager/admin/shop/(pages)/settings/components/CurrenciesActionsSection";
import { CurrenciesTable } from "@/app/(default)/account-manager/admin/shop/(pages)/settings/components/CurrenciesTable";
import { prisma } from "@/lib/prisma";

async function fetchExchangeRates() {
	const exchangeRates = await prisma.exchange_rates.findMany();
	return exchangeRates;
}

export default async function AdminSettings() {
	const exchangeRates = await fetchExchangeRates();

	return (
		<>
			<CurrenciesActionsSection />
			<CurrenciesTable exchangeRates={exchangeRates} />
		</>
	);
}

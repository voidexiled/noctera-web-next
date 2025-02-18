import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
type ExchangeRateType = {
	where: Prisma.exchange_ratesWhereInput;
	select?: Prisma.exchange_ratesSelect;
};
export async function getExchangeRate({ where, select }: ExchangeRateType) {
	const exchangeRate = await prisma.exchange_rates.findFirst({
		where,
		select,
	});

	return exchangeRate;
}

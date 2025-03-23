"use client";
import { countries } from "@/components/(account-manager)/(manager)/data/countries";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Prisma, exchange_rates } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type CurrencyFreaksResponseType = {
	date: string;
	base: string;
	rates: {
		[code: string]: string;
	};
};

export default function CurrenciesActionsSection() {
	const router = useRouter();
	async function handleUpdateAll() {
		await fetchExchangeRates().then((res) => {
			updateCurrencyRates(res);
		});
	}

	function updateCurrencyRates(res: CurrencyFreaksResponseType) {
		console.log("rates", res.rates);
		const formatedRates: Prisma.exchange_ratesUpdateInput[] = countries.map((country) => {
			const findedCurrencyInRes = res.rates[country.code.toUpperCase()];
			return {
				base_currency: "usd",
				target_currency: country.code,
				rate: Number.parseFloat(findedCurrencyInRes),
				updatedAt: new Date(),
			};
		});
		console.log("formatedRates", formatedRates);
		toast
			.promise(
				fetch("/api/administration/currency/update", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formatedRates),
				}),
				{
					loading: "Updating local currency rates...",
					success: "Currency rates updated successfully!",
					error: "Error updating currency rates.",
				},
			)
			.unwrap()
			.then((res) => {
				router.refresh();
				return res;
			});
	}

	async function fetchExchangeRates() {
		const res: CurrencyFreaksResponseType = await toast
			.promise(
				fetch(
					`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_FREAKS_API_KEY}`,
				),
				{
					loading: "Obtaining updated currency rates...",
					success: "Currency rates fetched successfully!",
					error: "Error obtaining currency rates.",
				},
			)
			.unwrap()
			.then((res) => res.json());
		console.log(res);
		return res;
	}

	return (
		<div className="flex flex-row justify-end">
			<div className="">
				<Button variant="blue" className="px-3" onClick={handleUpdateAll}>
					Update all
				</Button>
			</div>
		</div>
	);
}

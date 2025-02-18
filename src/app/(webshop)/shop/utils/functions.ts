import { currencySymbols } from "@/app/account-manager/(manager)/components/data/countries";

export const formatCurrency = (amount: number, currency: string) => {
	return `${currencySymbols[currency]}${amount.toFixed(2)}`;
};

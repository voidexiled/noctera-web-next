import { currencySymbols } from "@/components/(account-manager)/(manager)/data/countries";

export const formatCurrency = (amount: number, currency: string) => {
	return `${currencySymbols[currency]}${amount.toFixed(2)}`;
};

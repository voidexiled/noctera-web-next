import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Coin Shop",
	description: "Advanced form example using react-hook-form and Zod.",
};

interface ShopLayoutProps {
	children: React.ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/account-manager/login");

	return <>{children}</>;
}

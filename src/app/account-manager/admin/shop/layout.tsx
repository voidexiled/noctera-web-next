import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import { ShopAdminNav } from "./components/main-nav";

export const metadata: Metadata = {
	title: "Admin Shop Panel",
};

interface AdminLayoutProps {
	children: React.ReactNode;
}

export default async function SettingsLayout({ children }: AdminLayoutProps) {
	const session = await getServerSession(authOptions);
	const rule = session?.user.role;
	if (!session?.user) redirect("/account-manager/login");
	if (rule !== "admin") redirect("/account-manager/login");

	return (
		<>
			<ShopAdminNav />
			{children}
		</>
	);
}

import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Battlepass",
	description: "Noctera-global battlepass tracker",
};

interface BattlepassLayoutProps {
	children: React.ReactNode;
}

export default async function BattlepassLayout({
	children,
}: BattlepassLayoutProps) {
	const session = await getServerSession(authOptions);
	console.log(!session ? "NotSession" : "Session" );
	if (!session) redirect("/account-manager/login");

	return <>{children}</>;
}

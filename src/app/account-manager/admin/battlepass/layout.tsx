import { BattlepassAdminContent } from "@/app/account-manager/admin/battlepass/components/BattlepassAdminContent";
import { BattlepassNav } from "@/app/account-manager/admin/battlepass/components/BattlepassNav";
import { AdminBattlepassProvider } from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin Panel - Battlepass",
};

export default async function AdminBattlepass({ children }: { children: React.ReactNode }) {
	return (
		<Card>
			<CardHeader className="border-b bg-background">
				<CardTitle>Battlepass Manager</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<BattlepassNav />
				{children}
			</CardContent>
		</Card>
	);
}

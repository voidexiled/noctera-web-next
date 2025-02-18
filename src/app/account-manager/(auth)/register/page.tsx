import type { Metadata } from "next";

import { UseRegisterForm } from "@/app/account-manager/(auth)/register/components/user-register-form";
import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import configLua from "@/hooks/useConfigLua";
const lua = configLua();

export const metadata: Metadata = {
	title: "Create Account",
	description: "Login forms built using the components.",
};

export default function Register() {
	return (
		<Card className="relative rounded-md bg-background text-foreground">
			<CardHeader className="border-b ">
				<CardTitle>Create New Account</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-1 ">
				<div>
					<UseRegisterForm />
				</div>
			</CardContent>
		</Card>
	);
}

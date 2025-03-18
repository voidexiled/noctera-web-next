import type { Metadata } from "next";

import { UserRegisterForm } from "@/components/(account-manager)/(auth)/register/UserRegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import configLua from "@/hooks/useConfigLua";
const lua = configLua();

export const metadata: Metadata = {
	title: "Create Account",
	description: "Login forms built using the components.",
};

export default function Register() {
	return (
		<Card className="relative rounded-md text-foreground">
			<CardHeader className="border-b ">
				<CardTitle>Create New Account</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-1 ">
				<UserRegisterForm />
			</CardContent>
		</Card>
	);
}

import type { Metadata } from "next";

import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseRegisterForm } from "./components/user-register-form";

import { ScrollArea } from "@/components/ui/scroll-area";
import configLua from "@/hooks/configLua";
const lua = configLua();

export const metadata: Metadata = {
	title: "Create Account",
	description: "Login forms built using the components.",
};

export default function Register() {
	return (
		<>
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
		</>
	);
}

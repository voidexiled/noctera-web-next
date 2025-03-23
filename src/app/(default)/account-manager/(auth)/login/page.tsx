import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UserAuthForm } from "@/components/(account-manager)/(auth)/login/UserAuthForm";

export const metadata: Metadata = {
	title: "Login",
	description: "Noctera global - Login.",
};

export default function Login() {
	return (
		<div className="space-y-2">
			{/* <Card>
				<CardHeader className="border-b">
					<CardTitle>Important Information!</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Typography variant={"body2"} component={"p"}>
						You have forgotten your email address but you still know the account name which had been
						used for your Tibia account?
					</Typography>
					<Typography variant={"body2"} component={"p"}>
						Get your email address here: link
					</Typography>
				</CardContent>
			</Card> */}
			<Card className="text-card-foreground">
				<CardHeader className="border-b">
					<CardTitle>Account Login</CardTitle>
				</CardHeader>
				<CardContent>
					<UserAuthForm />
				</CardContent>
			</Card>
		</div>
	);
}

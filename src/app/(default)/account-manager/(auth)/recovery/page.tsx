import type { Metadata } from "next";

import { UserRecoveryForm } from "@/components/(account-manager)/(auth)/recovery/UserRecoveryForm";
import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Recover Password",
	description: "Login forms built using the components.",
};

export default function Recovery() {
	return (
		<Card className="w-full">
			<CardHeader className="space-y-1 text-center">
				<CardTitle className="font-bold text-2xl">Account Recovery</CardTitle>{" "}
				{/* More prominent title */}
				<Typography variant="caption" className="text-sm text-zinc-400">
					Enter your email or character name to start the recovery process.
				</Typography>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="rounded-md bg-card p-4 text-sm ">
					<Typography variant="body1" className="mb-2">
						Welcome to the Account Recovery Interface. If you've lost access to your account, we can
						help. To begin, please enter either your character name or the email address associated
						with your account.
					</Typography>
					<Typography variant="body2" className="mb-1 font-semibold">
						What you can do here:
					</Typography>
					<ul className="list-inside list-disc space-y-1">
						<li>Reset your password if you've forgotten it.</li>
						<li>Recover a hacked account.</li>
						<li>Change your account email (requires recovery key or TAN).</li>
						{/* Removed less common or detailed points for brevity - could be in a FAQ or help section */}
					</ul>
					<Typography variant="caption" className="mt-2 block">
						For more advanced options or detailed instructions, please refer to our{" "}
						<a
							href="https://www.noctera-global.com/support"
							className="text-primary underline underline-offset-2"
						>
							Help Center
						</a>
						.
					</Typography>
				</div>
				{/* Recovery Form Section - Now takes full width */}
				<div className="pt-2">
					<UserRecoveryForm />
				</div>
			</CardContent>
		</Card>
	);
}

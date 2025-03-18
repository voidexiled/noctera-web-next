"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

type ResendVerificationEmailButtonProps = {
	accountName: string;
	accountEmail: string;
};

export function ResendVerificationEmailButton({
	accountName,
	accountEmail,
}: ResendVerificationEmailButtonProps) {
	const handleSendEmail = () => {
		toast.promise(
			fetch("/api/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					accountName: accountName,
					targetEmail: accountEmail,
				}),
			}),
			{
				loading: "Sending email...",
				success: "Email sent!",
				error: "Failed to send email. Try again later.",
			},
		);
	};

	return (
		<div>
			Your account is not verified. Please{" "}
			<Button
				variant="link"
				className="px-0 py-0 font-semibold text-blue-300 hover:scale-[1] hover:underline"
				asChild
				onClick={handleSendEmail}
			>
				<Link href="#">verify</Link>
			</Button>{" "}
			your account.
		</div>
	);
}

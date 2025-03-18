"use client";
import { API_ROUTES } from "@/app/api/routes";
import type {
	AccountsUpdateEmailPOSTRequest,
	AccountsUpdateEmailPOSTResponse,
} from "@/app/api/types";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const passwordUppercase = z
	.string()
	.regex(/[A-Z]/, "The password should contain at least 1 uppercase character");
const passwordLowercase = z
	.string()
	.regex(/[a-z]/, "The password must contain at least one lowercase letter");
const passwordDigit = z
	.string()
	.regex(/\d/, "The password must contain at least one numeric digit");
const passwordSpecialChar = z
	.string()
	.regex(
		/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
		"The password must contain at least one special character",
	);

export function ChangeEmailButton() {
	const router = useRouter();

	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
	const loginFormSchema = z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.and(passwordUppercase)
			.and(passwordLowercase)
			.and(passwordDigit)
			.and(passwordSpecialChar),
		key: z.string().min(23),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;
	const methods = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		reValidateMode: "onChange",
	});

	const {
		handleSubmit,
		reset,
		watch,
		formState: { isSubmitting, isDirty },
	} = methods;

	async function onSubmit(data: LoginFormValues) {
		const response = await typedFetch<
			AccountsUpdateEmailPOSTRequest,
			AccountsUpdateEmailPOSTResponse
		>(API_ROUTES.accounts.update.email._, {
			method: "POST",
			body: {
				email: data.email,
				key: data.key,
				password: data.password,
			},
		});

		if (!response.error) {
			signOut({ redirect: true, callbackUrl: "/" });
			toast.success("Email has been changed");
			handle(false);
			return;
		}

		toast.error(response.error);
	}

	function handle(value: boolean) {
		if (!value) reset();
		setShowNewTeamDialog(value);
	}

	return (
		<>
			<Button size={"sm"} className="whitespace-nowrap" onClick={() => setShowNewTeamDialog(true)}>
				Change Email
			</Button>

			{showNewTeamDialog && (
				<Dialog open={showNewTeamDialog} onOpenChange={handle}>
					<DialogContent>
						<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
							<DialogHeader>
								<DialogTitle>Change Email</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 space-y-2 py-4">
								<div className="grid gap-4 ">
									<RHFTextField
										label="New Email"
										name="email"
										type="email"
										disabled={isSubmitting}
									/>
									<RHFTextField
										label="Your Password"
										name="password"
										type="password"
										disabled={isSubmitting}
									/>
								</div>
								<div className="space-y-3 rounded-sm border p-2 text-sm">
									<p>
										Please enter your <strong>Recovery Key</strong> to confirm the request to change
										your email.
									</p>
									<RHFTextField
										name="key"
										type="text"
										disabled={isSubmitting}
										maxLength={23}
										placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
										className="text-center"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									onClick={() => {
										reset();
										setShowNewTeamDialog(false);
									}}
									variant="outline"
								>
									Cancel
								</Button>
								<Button disabled={!(watch("key")?.length >= 18)} type="submit">
									{isSubmitting ? (
										<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
									) : (
										"Submit"
									)}
								</Button>
							</DialogFooter>
						</FormProvider>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}

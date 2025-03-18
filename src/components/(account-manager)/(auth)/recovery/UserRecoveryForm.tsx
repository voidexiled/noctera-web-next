"use client";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

import { API_ROUTES } from "@/app/api/routes";
import type {
	AuthRecoveryPasswordPOSTRequest,
	AuthRecoveryPasswordPOSTResponse,
} from "@/app/api/types";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { type TypedFetchBaseResponse, typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UserRecoveryFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRecoveryForm({ className, ...props }: UserRecoveryFormProps) {
	const loginFormSchema = z.object({
		email: z.string(),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;

	const methods = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
	});

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	async function onSubmit(data: LoginFormValues) {
		toast
			.promise(
				typedFetch<AuthRecoveryPasswordPOSTRequest, AuthRecoveryPasswordPOSTResponse>(
					API_ROUTES.auth.recoveryPassword._,
					{
						method: "POST",
						body: {
							email: data.email,
						},
					},
				),
				{
					loading: "Sending email with instructions...",
					success: "Email sent successfully",
					error: (err) => `${err}`,
				},
			)
			.unwrap()
			.then((value: TypedFetchBaseResponse) => {
				if (value.status === 200) {
					reset();
					return;
				}
			});
	}

	return (
		<div className={cn("grid gap-4", className)} {...props}>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<RHFTextField
					name="email"
					label="Email Address/Account Name"
					type="text"
					autoCapitalize="none"
					autoComplete="email"
					autoCorrect="off"
					disabled={isSubmitting}
				/>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Button variant={"link"} asChild className="order-2 sm:order-1">
						<Link href="/account-manager/login">Go to Login</Link>
					</Button>
					<Button disabled={isSubmitting} type="submit" className="order-1 sm:order-2">
						{isSubmitting ? (
							<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
						) : (
							"Send"
						)}
					</Button>
				</div>
			</FormProvider>
		</div>
	);
}

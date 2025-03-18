"use client";
import { API_ROUTES } from "@/app/api/routes";
import type { AuthResetPasswordPOSTRequest, AuthResetPasswordPOSTResponse } from "@/app/api/types";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { type TypedFetchBaseResponse, typedFetch } from "@/utils/typedFetch";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { use, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Character(props: { params: Promise<{ key: string }> }) {
	const [isLoading, startTransition] = useTransition();
	const params = use(props.params);
	const characterFormSchema = z.object({
		code: z.string(),
		token: z.string(),
	});

	type CharacterFormValues = z.infer<typeof characterFormSchema>;

	const methods = useForm<CharacterFormValues>({
		resolver: zodResolver(characterFormSchema),
		defaultValues: {
			token: params.key,
		},
	});

	const {
		reset,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	async function onSubmit(data: CharacterFormValues) {
		try {
			startTransition(() => {
				toast
					.promise(
						typedFetch<AuthResetPasswordPOSTRequest, AuthResetPasswordPOSTResponse>(
							API_ROUTES.auth.resetPassword._,
							{
								method: "POST",
								body: {
									code: params.key,
									token: data.token,
								},
							},
						),
					)
					.unwrap()
					.then((res: TypedFetchBaseResponse) => {
						if (!res.error) {
							return;
						}
						toast.error(res.error);
					});
			});
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
			reset();
		}
	}

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Confirmation reset password</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<FormProvider
					methods={methods}
					onSubmit={handleSubmit(onSubmit)}
					className="rounded-sm p-2"
				>
					<RHFTextField name="code" label="Activation Code" disabled={isLoading || isSubmitting} />
					<DialogFooter>
						<Button disabled={isSubmitting || isLoading} type="submit">
							{isSubmitting || isLoading ? (
								<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
							) : (
								"Submit"
							)}
						</Button>
					</DialogFooter>
				</FormProvider>
			</CardContent>
		</Card>
	);
}

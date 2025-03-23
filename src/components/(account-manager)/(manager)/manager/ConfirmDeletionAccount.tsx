"use client";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ConfirmDeletionAccount() {
	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

	const loginFormSchema = z.object({
		password: z.string().min(8),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;

	const methods = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
	});

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting, isDirty },
	} = methods;

	async function onSubmit(data: LoginFormValues) {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		toast.success(
			"You have successfully deleted your account, you will be redirected to the login page.",
		);
	}

	function handle(value: boolean) {
		if (!value) reset();
		setShowNewTeamDialog(value);
	}

	return (
		<>
			<Button
				size={"sm"}
				variant={"destructive"}
				className="whitespace-nowrap"
				onClick={() => setShowNewTeamDialog(true)}
			>
				Terminate Account
			</Button>
			{showNewTeamDialog && (
				<Dialog open={showNewTeamDialog} onOpenChange={handle}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Terminate Account</DialogTitle>
						</DialogHeader>
						<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-4 py-4">
								<p className="font-bold">
									Do you really want to terminate your Tibia account and delete all of your
									characters?
								</p>
								<div className="space-y-3 rounded-sm border p-2 text-sm">
									<p>
										Please enter your <strong>Password</strong> to confirm the deletion your
										Account.
									</p>
									<RHFTextField name="key" type="text" disabled={isSubmitting} />
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
								<Button disabled={isSubmitting || !isDirty} type="submit">
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

"use client";
import { Typography } from "@/components/Typography";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, use, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export default function Character(props: {
	params: Promise<{ key: string }>;
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const [recoveryKey, setRecoveryKey] = useState("");
	const [isLoading, startTransition] = useTransition();
	const searchParams = use(props.searchParams);
	const params = use(props.params);
	console.log(searchParams);
	console.log(params);
	const router = useRouter();

	async function verifyEmail() {
		startTransition(async () => {
			const response = await fetch("/api/auth/active-email", {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
				body: JSON.stringify({
					token: params.key,
					code: searchParams.key,
				}),
			});

			if (response.ok) {
				const res: {
					recover_key: string;
				} = await response.json();
				setRecoveryKey(res.recover_key);

				toast.success("You email has been verified.", {
					action: (
						<Button variant="link" onClick={() => router.replace("/account-manager/")}>
							Go to account manager
						</Button>
					),
				});
				setTimeout(() => {
					toast.info("Save your recovery key in a safe place.");
				}, 650);
			} else {
				const errorMessage: {
					message: string;
				} = await response.json();

				toast.error(errorMessage.message);
			}
		});
	}

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Confirmation email</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 p-2">
				<div>
					<Label>Activation Code</Label>
					<Input name="code" defaultValue={params.key} />
				</div>

				{recoveryKey && recoveryKey.length > 0 && (
					<motion.div
						className="grid p-4"
						initial={{ opacity: 0, y: 10, scale: 0 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.3, type: "tween" }}
					>
						<Typography component="h2" variant="h2">
							Save your recovery key in a safe place.
						</Typography>
						<div className="mt-3 grid grid-cols-[1fr_20px] rounded-md border p-3">
							<span className="font-semibold text-lg">{recoveryKey}</span>
							<div className="flex items-center">
								<CopyIcon
									className="h-4 w-4 cursor-pointer text-zinc-300 transition-all delay-0 duration-150 hover:text-zinc-400"
									onClick={async () => {
										try {
											await navigator.clipboard.writeText(recoveryKey);
											toast.success("Recovery key copied to clipboard.");
										} catch (error) {
											if (window.isSecureContext) {
												toast.error("Error al copiar el key");
											} else {
												toast.error("Clipboard not supported, please use https.");
											}
										}
									}}
								/>
							</div>
						</div>
					</motion.div>
				)}
				<DialogFooter>
					<Button disabled={isLoading} type="button" onClick={verifyEmail}>
						{isLoading ? (
							<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
						) : (
							"Verify"
						)}
					</Button>
				</DialogFooter>
			</CardContent>
		</Card>
	);
}

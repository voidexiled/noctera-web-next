"use client";
import type { PlayersSelectOptions } from "@/app/(community)/guilds/guilds";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	name: z.string(),
	leader: z.string(),
});

type ItemFormValues = z.infer<typeof FormSchema>;

export default function CreateGuild({
	players,
}: { players: PlayersSelectOptions[] }) {
	const router = useRouter();

	const methods = useForm<ItemFormValues>({
		resolver: zodResolver(FormSchema),
	});
	const {
		handleSubmit,
		watch,
		reset,
		formState: { isSubmitting, isDirty },
	} = methods;
	const values = watch();

	async function onSubmit(formData: ItemFormValues) {
		try {
			const res = await fetch("/api/guilds/manager", {
				method: "POST",
				body: JSON.stringify({
					guild_name: formData.name,
					player_id: +formData.leader,
				}),
			});
			if (res.ok) {
				toast({
					title: "Success!",
					description: <div>Guild as been created</div>,
					variant: "success",
				});
				document.getElementById("closeDialog")?.click();
				reset();
				router.push(`/guilds/${formData.name}`);
				return;
			}
			if (res.status === 400) {
				const body = await res.json();
				toast({
					title: "Error!",
					description: <div>{body.message}</div>,
					variant: "destructive",
				});
			} else if (res.status === 401) {
				const body = await res.json();
				toast({
					title: "Error!",
					description: <div>{body.message}</div>,
					variant: "destructive",
				});
				router.push("/account-manager");
			}
		} catch (e: unknown) {
			console.error(e);
			// toast({
			// 	title: "Error!",
			// 	description: <div>{e}</div>,
			// 	variant: "destructive",
			// });
		}
	}

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="h-9 whitespace-nowrap">Found Guild</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Found Guild</DialogTitle>
					</DialogHeader>
					<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
						<RHFSelect
							name="leader"
							label="Leader"
							options={players}
							LabelOption="label"
							keyValue="value"
						/>
						<RHFTextField name="name" label="Guild Name" />
						<DialogFooter>
							<DialogClose asChild id="closeDialog">
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button
								disabled={!values.name || isSubmitting || !isDirty}
								type="submit"
							>
								Submit
							</Button>
						</DialogFooter>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</>
	);
}

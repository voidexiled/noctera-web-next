"use client";
import type { PlayersSelectOptions } from "@/components/(community)/guilds/types/guilds";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	name: z.string(),
	leader: z.string(),
});

type ItemFormValues = z.infer<typeof FormSchema>;

export const CreateGuildDialog = ({ players }: { players: PlayersSelectOptions[] }) => {
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
				toast.success("Guild has been created");
				document.getElementById("closeDialog")?.click();
				reset();
				router.push(`/guilds/${formData.name}`);
				return;
			}
			if (res.status === 400) {
				const body = await res.json();
				toast.error(body.message);
			} else if (res.status === 401) {
				const body = await res.json();
				toast.error(body.message);
				router.push("/account-manager");
			}
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Found Guild</DialogTitle>
			</DialogHeader>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<RHFSelect
					disabled={isSubmitting || players.length === 0}
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
						disabled={!values.name || isSubmitting || !isDirty || !values.leader}
						type="submit"
					>
						Submit
					</Button>
				</DialogFooter>
			</FormProvider>
		</DialogContent>
	);
};

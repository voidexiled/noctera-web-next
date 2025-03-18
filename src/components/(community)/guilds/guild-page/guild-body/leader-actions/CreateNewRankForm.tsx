"use client";
import { FormProvider, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	guild_id: z.number(),
	rank: z.string(),
});
type ItemFormValues = z.infer<typeof FormSchema>;

type CreateNewRankFormProps = {
	guild_id: number;
	onSuccessAction: () => void;
};

export default function CreateNewRankForm({ guild_id, onSuccessAction }: CreateNewRankFormProps) {
	const router = useRouter();

	const defaultValues: Partial<ItemFormValues> = {
		guild_id,
	};

	const methods = useForm<ItemFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	async function onSubmit(formData: ItemFormValues) {
		try {
			const res = await fetch(`/api/guilds/manager/${guild_id}/ranks`, {
				method: "POST",
				body: JSON.stringify(formData),
			});
			if (res.ok) {
				const data: {
					rank: string;
				} = await res.json();
				toast.success(`Rank ${formData.rank} created successfully`);
				onSuccessAction();
			}
			// document.getElementById('closeDialog')?.click();
			router.refresh();
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	return (
		<FormProvider
			methods={methods}
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-row items-end "
		>
			<RHFTextField name="rank" label="Create new Rank" />
			<Button disabled={isSubmitting} size={"default"}>
				Create
			</Button>
		</FormProvider>
	);
}

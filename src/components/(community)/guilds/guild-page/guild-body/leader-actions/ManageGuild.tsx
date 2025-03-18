"use client";
import { updateGuild } from "@/actions/guilds/actions";
import { FormProvider } from "@/components/common/hook-form";
import RHFTextarea from "@/components/common/hook-form/RHFTextarea";
import { RHFUploadGuildImage } from "@/components/common/hook-form/RHFUpload";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fData } from "@/utils/formatNumber";
import type { CustomFile } from "@/utils/getFileData";
import { zodResolver } from "@hookform/resolvers/zod";
import type { guilds } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	motd: z.string(),
	description: z.string(),
	banner: z.custom<CustomFile | string>(),
});

type FormValues = z.infer<typeof FormSchema>;

type ManageGuildProps = {
	guild: guilds;
	defaultValues: FormValues;
};

export const ManageGuild = ({ guild, defaultValues }: ManageGuildProps) => {
	const [showModal, setShowModal] = useState(false);
	const methods = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});
	const { handleSubmit, setValue, reset, formState } = methods;

	function handleModal() {
		setShowModal(!showModal);
		reset(defaultValues);
	}

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});
			if (file) setValue("banner", newFile, { shouldValidate: true });
		},
		[setValue],
	);

	async function onSubmit(formData: FormValues) {
		try {
			document.getElementById("closeDialog")?.click();

			const data = new FormData();
			data.set("banner", formData.banner);
			data.set("motd", formData.motd ?? "");
			data.set("description", formData.description ?? "");

			toast.promise(updateGuild(guild.id, data), {
				loading: "Updating Guild...",
				success: "Guild updated successfully!",
				error: "An error ocurred while updating the guild!",
			});
			reset(defaultValues);
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	return (
		<Dialog open={showModal} onOpenChange={handleModal}>
			<DialogTrigger asChild>
				<Button className="w-full" onClick={() => setShowModal(false)} size="sm">
					Manager Guild
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manager Guild</DialogTitle>
				</DialogHeader>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<div className="text-center text-xs">
						Image only .jpg, .gif, .png, .bmp pictures. Max. size: {fData(5000000)}
					</div>
					<div className="flex flex-row gap-3">
						<RHFUploadGuildImage
							name="banner"
							accept={{ image: [".jpg", ".bmp", ".png", ".gif"] }}
							maxSize={5000000} // 5MB
							onDrop={handleDrop}
						/>
						<RHFTextarea name="description" placeholder="Guild Description" />
					</div>
					<RHFTextarea name="motd" label="Guild MOTD" placeholder="Guild Message of the Day" />
					<DialogFooter>
						<DialogClose asChild>
							<Button id="closeDialog" variant="outline" onClick={() => reset(defaultValues)}>
								Cancel
							</Button>
						</DialogClose>
						<Button disabled={formState.isSubmitting} type="submit">
							Save
						</Button>
					</DialogFooter>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};

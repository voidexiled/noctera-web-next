"use client";
import { updateGuild } from "@/app/(community)/guilds/data";
import { FormProvider } from "@/components/hook-form";
import RHFTextarea from "@/components/hook-form/RHFTextarea";
import { RHFUploadGuildImage } from "@/components/hook-form/RHFUpload";
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
import { fData } from "@/utils/formatNumber";
import type { CustomFile } from "@/utils/getFileData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	motd: z.string(),
	description: z.string(),
	banner: z.custom<CustomFile | string>(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ManagerGuild({
	guild_id,
	defaultValues,
}: {
	guild_id: number;
	defaultValues: { banner: string; description: string; motd: string };
}) {
	const [showModal, setShowModal] = useState(false);

	const methods = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});
	const {
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = methods;
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
			await updateGuild(guild_id, data);
			toast({
				title: "Success!",
				description: <div>Guild as been updated</div>,
				variant: "success",
			});
			reset(defaultValues);
		} catch (e) {
			console.error(e);
			// toast({
			// 	title: "Error!",
			// 	description: <div>Error on update</div>,
			// 	variant: "destructive",
			// });
		}
	}

	const handleModal = () => {
		setShowModal(!showModal);
		reset(defaultValues);
	};
	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	return (
		<>
			<Dialog open={showModal} onOpenChange={handleModal}>
				<DialogTrigger asChild>
					<Button className="w-full" onClick={() => setShowModal(false)}>
						Manager Guild
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Manager Guild</DialogTitle>
					</DialogHeader>
					<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
						<div className="text-center text-xs">
							Image only .jpg, .gif, .png, .bmp pictures. Max. size:{" "}
							{fData(5000000)}
						</div>
						<div className="flex flex-row gap-3">
							<RHFUploadGuildImage
								name="banner"
								accept={{ image: [".jpg", ".bmp", ".png", ".gif"] }}
								maxSize={5000000}
								onDrop={handleDrop}
							/>
							<RHFTextarea name="description" placeholder="Guild Description" />
						</div>
						<RHFTextarea name="motd" label="Guild MOTD" placeholder="Method" />
						<DialogFooter>
							<DialogClose asChild>
								<Button
									id="closeDialog"
									variant="outline"
									onClick={() => reset(defaultValues)}
								>
									Cancel
								</Button>
							</DialogClose>
							<Button disabled={isSubmitting} type="submit">
								Save
							</Button>
						</DialogFooter>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</>
	);
}

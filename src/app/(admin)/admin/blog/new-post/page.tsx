"use client";

import { API_ROUTES } from "@/app/api/routes";
import type {
	AdministrationBlogPOSTRequest,
	AdministrationBlogPOSTResponse,
} from "@/app/api/types";
import { NewEditor } from "@/components/(news)/last-news/NewEditor";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import type { POST_TYPE } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function NewPostAdminPage() {
	const FormSchema = z.object({
		title: z.string(),
		content: z.custom<string>(),
		category: z.enum(["BLOG", "ROADMAP", "TICKER"]),
	});
	type FormValues = z.infer<typeof FormSchema>;
	const methods = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			content: "",
			title: "",
			category: "BLOG",
		},
	});

	const { handleSubmit, getValues, reset, trigger, setValue, watch } = methods;

	async function onSubmit(data: FormValues) {
		try {
			toast.promise(
				typedFetch<AdministrationBlogPOSTRequest, AdministrationBlogPOSTResponse>(
					API_ROUTES.administration.blog._,
					{
						method: "POST",
						body: data,
					},
				),
				{
					loading: "Creating post...",
					success: "Post created successfully!",
					error: "Error creating post.",
				},
			);
		} catch (e) {
			const error: Error = e as Error;
			if (error.message) {
				console.error(error);
			}
			throw error;
		}
	}

	return (
		<div className="relative h-full max-h-full w-full max-w-full">
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<RHFTextField
					name="title"
					placeholder="Title"
					onChange={() => {
						trigger("title");
					}}
				/>
				<RHFSelect
					LabelOption="name"
					keyValue="id"
					name="category"
					options={[
						{ name: "News", id: "BLOG" },
						{ name: "Roadmap", id: "ROADMAP" },
						{ name: "Log", id: "TICKER" },
					]}
					placeholder="Category"
					defaultValue={getValues("category")}
					onValueChange={(value) => {
						trigger("category");
						setValue("category", value as "BLOG" | "ROADMAP" | "TICKER");
					}}
				/>
				<NewEditor name="content" id="content" />
				<Button type="submit">Create</Button>
			</FormProvider>
			{watch("content") && (
				<div
					className="no-tailwindcss-base text-wrap"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: watch("content") }}
				/>
			)}
		</div>
	);
}

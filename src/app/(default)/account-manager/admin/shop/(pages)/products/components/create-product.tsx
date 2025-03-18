"use client";
import { createProduct } from "@/app/(default)/account-manager/admin/shop/(pages)/products/data";
import { IconiFy } from "@/components/common/Iconify";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { RHFUploadShopImage } from "@/components/common/hook-form/RHFUpload";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CustomFile } from "@/components/upload/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as Prisma from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	img: z.custom<File>((file) => file instanceof File, "Required"),
	// img: z.string(),
	title: z.string(),
	price: z.string(),
	category: z.string(),
	currency: z.string(),
	quantity: z.string(),
});

type CharacterFormValues = z.infer<typeof FormSchema> & {
	img: CustomFile | string;
};

export default function CreateProduct({
	categories,
}: { categories: Prisma.products_categories[] }) {
	const route = useRouter();

	const [showModal, setShowModal] = useState(false);

	const product_categories = categories.map((category) => ({
		label: category.name.toString(),
		value: category.id.toString(),
	}));

	const methods = useForm<CharacterFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			currency: "USD",
		},
	});

	const {
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { isSubmitting },
	} = methods;
	const values = watch();

	function handle() {
		if (!showModal) reset();
		setShowModal(!showModal);
	}

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});
			if (file) {
				setValue("img", newFile, { shouldValidate: true });
			}
		},
		[setValue],
	);

	async function onSubmit(formData: CharacterFormValues) {
		try {
			const data = new FormData();

			data.set("img", values.img);
			data.set("title", formData.title);
			data.set("price", formData.price);
			data.set("category", formData.category);
			data.set("quantity", formData.quantity);
			data.set("currency", formData.currency);
			const res = await createProduct(data);

			// const res = await fetch("/api/administration/shop/products", {
			// 	method: "POST",
			// 	body: data,
			// });
			if (res) {
				route.refresh();
				toast.success("Product as been created");
			}
		} catch (e) {
			// Handle errors here
			console.error(e);
		}
		handle();
	}

	return (
		<>
			<Dialog open={showModal} onOpenChange={handle} defaultOpen={false}>
				<DialogTrigger asChild>
					<Button onClick={handle}>Create New</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Product</DialogTitle>
					</DialogHeader>

					<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
						<RHFUploadShopImage
							name="img"
							accept={{ image: [".png", ".gif"] }}
							maxSize={3145728}
							onDrop={handleDrop}
						/>
						{/* <RHFTextField
							name="img"
							label="Image name file"
							autoFocus
							required
						/> */}

						<RHFTextField name="title" label="Title" autoFocus />
						<div className="grid gap-2 sm:grid-cols-3">
							<RHFTextField name="price" label="Price" />
							<RHFSelect
								name="currency"
								label="Currency"
								options={[
									{ value: "USD", label: "USD" },
									{ value: "EUR", label: "EUR" },
									{ value: "JPY", label: "JPY" },
									{ value: "BRL", label: "BRL" },
									{ value: "GBP", label: "GBP" },
								]}
								LabelOption={"label"}
								keyValue={"value"}
								defaultValue="USD"
							/>
							<RHFTextField name="quantity" label="Amount" />
						</div>

						<RHFSelect
							LabelOption={"label"}
							keyValue={"value"}
							name="category"
							options={product_categories}
							label="Category"
						/>

						<DialogFooter>
							<Button
								onClick={() => {
									reset();
									handle();
								}}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={!values.img || !values.price || !values.title || isSubmitting}
								type="submit"
							>
								{isSubmitting ? (
									<IconiFy icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
								) : (
									"Submit"
								)}
							</Button>
						</DialogFooter>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</>
	);
}

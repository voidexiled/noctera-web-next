"use client";
import { IconiFy } from "@/components/common/Iconify";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { RHFUpload, RHFUploadShopImage } from "@/components/common/hook-form/RHFUpload";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CustomFile } from "@/utils/getFileData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	img: z.custom<File>((file) => file instanceof File),
	title: z.string(),
	price: z.string(),
	currency: z.string(),
	category: z.string(),
	quantity: z.string(),
});

type ItemFormValues = z.infer<typeof FormSchema>;

interface FormValues extends Omit<ItemFormValues, "img"> {
	img: CustomFile | string;
}

export default function EditProduct({
	product,
}: {
	product: {
		id: number;
		img: string;
		title: string;
		price: string;
		quantity: string;
		category: string;
		currency: string;
	};
}) {
	const route = useRouter();

	const [showModal, setShowModal] = useState(false);

	const methods = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: product.title,
			category: product.category,
			price: product.price,
			currency: product.currency,
			quantity: product.quantity,
			img: product.img,
		},
	});

	const {
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { isSubmitting, isDirty },
	} = methods;
	const values = watch();

	function handle() {
		setShowModal(!showModal);
	}

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});
			if (file) setValue("img", newFile, { shouldValidate: true });
		},
		[setValue],
	);

	async function onSubmit(formData: FormValues) {
		try {
			const data = new FormData();
			data.set("img", values.img);
			data.set("title", formData.title);
			data.set("price", formData.price);
			data.set("currency", formData.currency);
			data.set("category", formData.category);
			data.set("quantity", formData.quantity);
			const res = await fetch(`/api/administration/shop/products/${product.id}`, {
				method: "PUT",
				body: data,
			});
			if (res.ok) {
				route.refresh();
				toast.success("Product as been updated");
			}
		} catch (e) {
			console.error(e);
		}
		handle();
	}

	return (
		<>
			<Dialog open={showModal} onOpenChange={handle} defaultOpen={false}>
				<DialogTrigger asChild>
					<Button variant={"ghost"} size={"sm"} className="w-full justify-start px-2 text-[14px]">
						Edit
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Product</DialogTitle>
					</DialogHeader>

					<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
						{/* <RHFUploadShopImage
            name="img"
            accept={{ 'image': ['.png', '.gif'] }}
            maxSize={3145728}
            onDrop={handleDrop}
          /> */}
						<RHFTextField name="img" label="Image name file" autoFocus required />
						<RHFTextField name="title" label="Title" />
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
								defaultValue={watch("currency")}
							/>
							<RHFTextField name="quantity" label="Amount" />
						</div>
						<RHFSelect
							LabelOption={"label"}
							defaultValue={product.category}
							keyValue={"value"}
							name="category"
							options={[
								{ value: "1", label: "Coins" },
								{ value: "2", label: "Premium Time" },
							]}
							label="Category"
						/>
						<DialogFooter>
							<Button
								onClick={(e) => {
									e.preventDefault();
									handle();
								}}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={
									!values.img ||
									!values.price ||
									!values.title ||
									!values.category ||
									!values.quantity ||
									isSubmitting ||
									!isDirty
								}
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

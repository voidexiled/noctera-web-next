"use client";
import { RHFUpload } from "@/components/common/hook-form/RHFUpload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { InputProps } from "@/components/ui/input";
import Upload from "@/components/upload/Upload";
import UploadGuildImage from "@/components/upload/UploadGuild";
import useDisclosure from "@/hooks/useDisclosure";
import { Editor } from "@tinymce/tinymce-react";
import React, { useCallback, useEffect, useState } from "react";
import type { Accept } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
interface FileItem {
	file: File;
	base64: string;
	preview?: string;
}

type IProps = {
	name: string;
	label?: string;
	initialValue?: string;
};

type Props = IProps & InputProps;

export default function RHFTextEditor({ name, label, initialValue, ...other }: Props) {
	const [files, setFiles] = React.useState<FileItem[]>([]);
	const [progress, setProgress] = React.useState(0);
	const [isProcessing, setIsProcessing] = React.useState(false);
	const { isOpen, onClose, onOpen, onToggle } = useDisclosure(false);

	const { control } = useFormContext();
	const inputId = React.useId();

	const accepttypes: Accept = {
		"image/*": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".bmp", ".webp"],
		"video/*": [".mp4", ".webm", ".ogg", ".mov"],
	};

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setIsProcessing(true);
		setProgress(0);

		const newFiles: FileItem[] = [];
		const total = acceptedFiles.length;
		console.log(acceptedFiles);

		for (let i = 0; i < total; i++) {
			const file = acceptedFiles[i];
			const base64 = await convertToBase64(file);
			const preview = file.type.startsWith("image/") ? base64 : undefined;

			newFiles.push({ file, base64, preview });
			setProgress(((i + 1) / total) * 100);
		}

		setFiles((prev) => [...prev, ...newFiles]);
		setIsProcessing(false);
	}, []);

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	return (
		<>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<div className="grid max-w-full gap-2">
						<Editor
							id={inputId}
							value={field.value}
							// ref={field.ref}
							onEditorChange={field.onChange}
							initialValue={initialValue}
							apiKey={process.env.NEXT_PUBLIC_TinyEditorAPI_KEY}
							cloudChannel="6"
							init={{
								min_height: 400,
								max_width: 800,
								menubar: true,
								skin: "oxide-dark",
								content_css: "dark",
								content_style:
									"p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; text-wrap: wrap; } p { font-size: 14px;} h1 { font-size: 24px; } h2 { font-size: 20px; } h3 { font-size: 18px; } h4 { font-size: 16px; } h5 { font-size: 14px; } h6 { font-size: 12px; } span { font-size: 14px; } img { margin: 8px; }",
								plugins:
									"autoresize preview importcss tinydrive searchreplace autolink autosave  directionality visualblocks visualchars image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
								toolbar:
									"undo redo preview | blocks fontsizeinput | bold italic strikethrough | align numlist bullist | link image | table media mediaembed | lineheight  outdent indent | forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen  | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
								statusbar: true,
								font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 28pt 36pt 48pt",
								image_caption: true,
								image_advtab: true,
								image_title: true,
								image_uploadtab: false,
								a11y_advanced_options: true,
							}}
						/>
					</div>
				)}
			/>
		</>
	);
}

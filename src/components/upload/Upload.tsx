import { type FileRejection, useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { Typography } from "../Typography";
import { IconiFy } from "../common/Iconify";
import { Button } from "../ui/button";
import RejectionFiles from "./errors/RejectionFiles";
import MultiFilePreview from "./preview/MultiFilePreview";
import SingleFilePreview from "./preview/SingleFilePreview";
import type { UploadProps } from "./types";

export default function Upload({
	disabled,
	multiple = false,
	error,
	helperText,
	file,
	onDelete,
	files,
	thumbnail,
	onUpload,
	isUploading,
	onRemove,
	onRemoveAll,
	...other
}: UploadProps) {
	const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
		multiple,
		disabled,
		...other,
	});

	const hasFile = !!file && !multiple;
	const hasFiles = files && multiple && files.length > 0;
	const isError = isDragReject || !!error;

	return (
		<div className="relative h-auto w-full">
			<div
				{...getRootProps()}
				className={cn(
					"block cursor-pointer select-none rounded-sm border border-gray-300 border-dashed p-1 outline-hidden",
					isError && "border-red-500",
					isDragActive && "border-gray-300/75 opacity-75",
					disabled && "pointer-events-none opacity-50",
				)}
			>
				<input {...getInputProps()} />
				{!hasFile && <Placeholder />}
				{hasFile && <SingleFilePreview file={file} />}
			</div>

			{helperText && helperText}

			<RejectionFiles fileRejections={fileRejections} />

			{hasFile && onDelete && !disabled && (
				<Button
					size="sm"
					onClick={onDelete}
					className="p absolute top-2 right-2 z-9 m-0 h-auto rounded-full p-1 opacity-75"
				>
					<IconiFy icon="eva:close-fill" size={"sm"} className="leading-none" />
				</Button>
			)}

			{hasFiles && (
				<>
					<div className="my-2">
						<MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
					</div>

					<div className="flex flex-row justify-end gap-2">
						{onRemoveAll && (
							<Button variant="outline" size="sm" onClick={onRemoveAll}>
								{" "}
								Remove all
							</Button>
						)}

						{onUpload && (
							<Button
								size="sm"
								onClick={(e) => {
									e.preventDefault();
									onUpload();
								}}
								disabled={isUploading}
							>
								Upload files
							</Button>
						)}
					</div>
				</>
			)}
		</div>
	);
}

function Placeholder({ dropZoneText = "Drop or Select file" }: { dropZoneText?: string }) {
	return (
		<div className="flex flex-col items-center justify-center p-2 text-center">
			<Typography variant="h5">{dropZoneText}</Typography>
			<Typography variant="body2" component="span">
				Drop files here or click browse thorough your machine
			</Typography>
		</div>
	);
}

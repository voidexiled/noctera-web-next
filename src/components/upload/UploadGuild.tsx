import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { IconiFy } from "../Iconify";
import RejectionFiles from "./errors/RejectionFiles";
import ShopPreview from "./preview/GuildPreview";
import type { UploadProps } from "./types";

export default function UploadGuildImage({
	error,
	file,
	disabled,
	helperText,
	...other
}: UploadProps) {
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		fileRejections,
	} = useDropzone({
		multiple: false,
		disabled,
		...other,
	});

	const hasFile = !!file;
	const isError = isDragReject || !!error;

	return (
		<>
			<div
				{...getRootProps()}
				className={cn(
					"relative m-auto flex h-[96px] w-[96px] cursor-pointer items-center justify-center rounded border border-dashed p-2",
					isDragActive && "opacity-75",
					isError && "border-red-300",
					disabled && "pointer-events-none opacity-50",
					hasFile && "",
				)}
			>
				<input {...getInputProps()} />

				{hasFile && <ShopPreview file={file} />}

				<div
					className={cn(
						"absolute z-[7] flex h-full w-full flex-col items-center justify-center rounded text-sm hover:opacity-70",
						hasFile && "z-10 bg-gray-900/70 text-white opacity-0",
						isError && "bg-red-200 text-red-500",
					)}
				>
					<IconiFy icon="ic:round-add-a-photo" className="mb-1" />
					<span>{file ? "Update" : "Upload"}</span>
				</div>
			</div>

			{helperText && helperText}

			<RejectionFiles fileRejections={fileRejections} />
		</>
	);
}

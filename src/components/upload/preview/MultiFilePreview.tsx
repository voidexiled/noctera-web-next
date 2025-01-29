import FileThumbnail, { fileData } from "../../file-thumbnail";

import { IconiFy } from "@/components/Iconify";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { fData } from "@/utils/formatNumber";
import type { UploadProps } from "../types";

export default function MultiFilePreview({
	thumbnail,
	files,
	onRemove,
}: UploadProps) {
	if (!files?.length) {
		return null;
	}

	return (
		<div>
			{files.map((file) => {
				const { key, name = "", size = 0 } = fileData(file);
				const isNotFormatFile = typeof file === "string";
				if (thumbnail) {
					return (
						<div key={key} className="">
							<FileThumbnail tooltip imageView file={file} />
							{onRemove && (
								<Button
									size="sm"
									onClick={() => onRemove(file)}
									className="m-0 mr-1 h-auto rounded-full p-0 opacity-75"
								>
									<IconiFy icon="eva:close-fill" className="w-4" />
								</Button>
							)}
						</div>
					);
				}
				return (
					<div
						key={key}
						className="relative flex items-center justify-center gap-2 rounded border p-1"
					>
						<FileThumbnail file={file} />

						<div className="min-w-0 grow">
							<Typography variant="subtitle2" className="text-xs">
								{isNotFormatFile ? file : name}
							</Typography>

							<Typography variant="caption" className="font-medium text-xs">
								{isNotFormatFile ? "" : fData(size)}
							</Typography>
						</div>

						{onRemove && (
							<Button
								size="sm"
								onClick={() => onRemove(file)}
								className="m-0 mr-1 h-auto rounded-full p-1 opacity-75"
							>
								<IconiFy icon="eva:close-fill" className="w-4" />
							</Button>
						)}
					</div>
				);
			})}
		</div>
	);
}

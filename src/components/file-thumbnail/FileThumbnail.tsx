import Image from "next/image";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import DownloadButton from "./DownloadButton";
//
import { fileData, fileFormat, fileThumb } from "./utils";

// ----------------------------------------------------------------------

type FileIconProps = {
	file: File | string;
	tooltip?: boolean;
	imageView?: boolean;
	onDownload?: VoidFunction;
};

export default function FileThumbnail({
	file,
	tooltip,
	imageView,
	onDownload,
}: FileIconProps) {
	const { name = "", path = "", preview = "" } = fileData(file);

	const format = fileFormat(path || preview);

	const renderContent =
		format === "image" && imageView ? (
			<Image
				src={preview}
				className="flex-shrink-0 object-cover"
				alt={""}
				width={300}
				height={300}
				style={{ width: "auto", height: "auto" }}
			/>
		) : (
			<Image
				src={fileThumb(format)}
				className="w-8 flex-shrink-0"
				alt={""}
				width={32}
				height={32}
				style={{ width: "32px", height: "auto" }}
			/>
		);

	if (tooltip) {
		return (
			<div title={name}>
				<span className="h-[inherit] w-fit flex-shrink-0 items-center justify-center">
					{renderContent}
					{onDownload && <DownloadButton onDownload={onDownload} />}
				</span>
			</div>
		);
	}

	return (
		<>
			{renderContent}
			{onDownload && <DownloadButton onDownload={onDownload} />}
		</>
	);
}

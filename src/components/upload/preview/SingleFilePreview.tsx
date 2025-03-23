import Image from "next/image";
import type { CustomFile } from "../types";

type Props = {
	file: CustomFile | string | null;
};

export default function SingleFilePreview({ file }: Props) {
	if (!file) {
		return null;
	}
	const imgUrl = typeof file === "string" ? file : file.preview;
	return (
		<div className="flex min-h-[64px] items-center justify-center">
			<Image
				src={imgUrl ?? ""}
				alt="Picture of the product"
				width={300}
				height={300}
				style={{
					width: "auto",
					height: "auto",
				}}
			/>
		</div>
	);
}

import { cn } from "@/lib/utils";
import Image from "next/image";

type GuildLogoProps = {
	src: HTMLImageElement["src"];
	alt?: HTMLImageElement["alt"];
	width?: HTMLImageElement["width"];
	height?: HTMLImageElement["height"];
	className?: HTMLDivElement["className"];
	pictureClassName?: HTMLPictureElement["className"];
	imgClassName?: HTMLImageElement["className"];
};
export const GuildLogo = ({
	src,
	alt,
	width,
	height,
	className,
	pictureClassName,
	imgClassName,
}: GuildLogoProps) => {
	return (
		<div className={cn("", className)}>
			<picture className={cn("", pictureClassName)}>
				<Image
					src={src}
					alt={alt ?? ""}
					width={width ?? 64}
					height={height ?? 64}
					className={cn("", imgClassName)}
				/>
			</picture>
		</div>
	);
};

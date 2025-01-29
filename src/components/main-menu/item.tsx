import ItemChild from "@/components/main-menu/item-child";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type ItemProps = {
	accordionValue: string;
	title: string;
	className?: string;
	imgSrc: string;
	imgAlt?: string;
	imgWidth?: number;
	imgHeight?: number;
	children?: React.ReactNode;
};

export default function Item({
	accordionValue,
	title,
	className,
	imgSrc,
	imgAlt,
	imgWidth,
	imgHeight,
	children,
}: ItemProps) {
	return (
		<AccordionItem value={accordionValue} className="border-none p-0 ">
			<AccordionTrigger className="rounded-sm bg-card p-1 px-2 text-card-foreground decoration-none">
				<div className={clsx("flex flex-row items-center gap-2", className)}>
					<Image
						src={imgSrc ?? ""}
						width={imgWidth ?? 24}
						height={imgHeight ?? 24}
						alt={imgAlt ?? ""}
					/>
					{title}
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<div className="mt-1 flex flex-col space-y-1 ">{children}</div>
			</AccordionContent>
		</AccordionItem>
	);
}

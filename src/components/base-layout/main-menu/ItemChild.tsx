import type { Url } from "node:url";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type ItemChildProps = {
	title: string;
	className?: string;
	href: string;
};

export default function ItemChild({ title, className, href }: ItemChildProps) {
	return (
		<Button size="sm" variant="itemchild" asChild className={cn("justify-between ", className)}>
			<Link href={href ?? "/"} className="truncate text-nowrap">
				{" "}
				{title}
			</Link>
		</Button>
	);
}

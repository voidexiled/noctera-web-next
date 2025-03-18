"use client";

import { getLogIcon } from "@/components/(news)/lib/functions";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { POST_TYPE, type posts } from "@prisma/client";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type LogItemProps = {
	log: posts;
	isFirst: boolean;
	isLast: boolean;
};

export const LogItem = ({ log, isFirst, isLast }: LogItemProps) => {
	const [collapsed, setCollapsed] = useState(true);

	const toggleCollapse = () => {
		setCollapsed(!collapsed);
	};

	return (
		<motion.div
			key={log.id}
			className={cn(
				"grid grid-cols-[auto_145px_1fr_auto] border-b bg-card/20 p-2 text-sm transition-[height,colors] duration-300 ease-in-out will-change-[height] hover:bg-card/60",
				isLast && "border-b-0",
				collapsed ? "h-fit" : "h-auto",
			)}
			onClick={toggleCollapse}
		>
			<div className="mr-2 flex h-fit items-center ">
				<Image
					src={getLogIcon(log.type) ?? getLogIcon(POST_TYPE.INFO)}
					alt="Log"
					width={18}
					height={18}
					unoptimized
				/>
			</div>
			<span className="truncate text-nowrap px-1 text-foreground/80">
				{dayjs(log.createdAt).format("MMM D YYYY HH:mm")}
			</span>
			<span
				className={cn(
					"text-pretty px-1 text-foreground/95 transition-all duration-300 ease-in-out will-change-[height]",
					collapsed ? "truncate text-nowrap" : "",
				)}
			>
				{log.title}
			</span>
			<motion.button
				type="button"
				className={cn("h-fit transform-gpu transition-transform duration-300 ease-in-out")}
			>
				<ChevronDown
					className={cn(
						"h-4 w-4 text-zinc-400 transition-transform duration-300 ease-in-out hover:text-zinc-200",
						collapsed ? "rotate-0" : "rotate-180",
					)}
				/>
			</motion.button>
		</motion.div>
	);
};

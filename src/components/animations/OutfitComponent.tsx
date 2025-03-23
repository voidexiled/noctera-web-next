"use client";
import { outfit } from "@/components/animations/lib/outfits";
import type { Frame, Outfit } from "@/components/animations/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
const validOutfitKeys = [
	"looktypeEx",
	"looktype",
	"lookaddons",
	"lookhead",
	"lookbody",
	"looklegs",
	"lookfeet",
	"mount",
	"resize",
];

function getOutfitUrl({
	resize,
	...params
}: {
	looktype: number;
	looktypeEx?: number;
	lookaddons?: number;
	lookhead?: number;
	lookbody?: number;
	looklegs?: number;
	lookfeet?: number;
	mount?: number;
	resize?: boolean;
}): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (!validOutfitKeys.includes(key)) {
			continue;
		}
		search.append(key, (value ?? 0).toString());
	}
	if (resize) {
		search.append("resize", "1");
	}
	return `/api/outfit?${search.toString()}`;
}

interface OutfitComponentProps {
	outfit: Outfit;
	alt?: string;
	className?: string;
}

export default function OutfitComponent({ outfit, alt, className }: OutfitComponentProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [frames, setFrames] = useState<Frame[]>([]);
	const [index, setIndex] = useState<number>(0);
	const [shownFor, setShownFor] = useState<number>(1000);

	const hasMount = (outfit.lookmount && outfit.lookmount > 0) || (outfit.mount && outfit.mount > 0);

	useEffect(() => {
		const sourceChanged = async () => {
			setFrames([]);

			if (!outfit || outfit.looktypeEx !== undefined) {
				return;
			}
			const { signal } = new AbortController();
			const response = await fetch(
				getOutfitUrl({
					...outfit,
					mount: outfit.mount ?? outfit.lookmount ?? 0,
					resize: true,
				}),
				{ cache: "force-cache", signal: signal, next: { revalidate: 3600 * 5 } },
			);
			const data = await response.json();
			console.log(`data of ${outfit.looktype}, ${outfit.looktypeEx}: `, data);

			const newFrames: Frame[] = data.frames.map(
				(frame: {
					image: string;
					duration: number;
				}) => ({
					...frame,
					image: (() => {
						const image = new Image();
						image.src = frame.image;
						return image;
					})(),
				}),
			);
			setFrames(newFrames);
		};

		sourceChanged();
	}, [outfit]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!canvasRef.current || frames.length === 0) return;

			setShownFor((prev) => prev + 50);

			if (shownFor >= frames[index].duration) {
				setShownFor(0);
				setIndex((prevIndex) => (prevIndex + 1) % frames.length);
			}
		}, 50);

		return () => clearInterval(intervalId);
	}, [index, shownFor, frames]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");

		if (canvas && context && frames.length > 0) {
			const frame = frames[index];
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(
				frame.image,
				0,
				0,
				frame.image.width,
				frame.image.height,
				0,
				0,
				canvas.width,
				canvas.height,
			);
		}
	}, [index, frames]);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>
					<motion.div
						className={cn("relative h-16 w-16", className)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
					>
						<div className="group absolute right-0 bottom-0">
							{frames && outfit.looktype > 0 ? (
								<canvas
									ref={canvasRef}
									className={cn("h-16 w-16 whitespace-nowrap", className)}
									aria-details={alt}
								/>
							) : (
								<>
									{outfit.looktypeEx && outfit.looktypeEx > 0 ? (
										<div className="grid h-16 w-16">
											<img
												src={`/animated-items/${outfit.looktypeEx}.gif`}
												alt="outfit"
												className={cn(
													"mt-auto mr-0 mb-0 ml-auto h-8 w-8 whitespace-nowrap",
													className,
												)}
												aria-details={alt}
											/>
										</div>
									) : (
										<div className="flex h-16 w-16 items-center justify-center text-gray-400 text-xs">
											?
										</div>
									)}
								</>
							)}
						</div>
					</motion.div>
				</TooltipTrigger>
				{alt && (
					<TooltipContent side="top" sideOffset={38}>
						{alt}
					</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
}

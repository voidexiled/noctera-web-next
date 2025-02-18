"use client";
import OutfitComponent from "@/components/animations/OutfitComponent";
import type { BoostedProps, Outfit } from "@/components/animations/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
type BoostedCardProps = {
	boosted: BoostedProps;
	kind: "creature" | "boss";
};
export const BoostedCard = ({ boosted, kind }: BoostedCardProps) => {
	const bossInfo = "Boosted boss carry 200% more exp and drops 200% amount";
	const boostedOutfit: Outfit = {
		looktype: boosted.looktype,
		lookaddons: boosted.lookaddons,
		lookbody: boosted.lookbody,
		lookfeet: boosted.lookfeet,
		looklegs: boosted.looklegs,
		lookhead: boosted.lookhead,
		lookmount: boosted.lookmount,
		looktypeEx:
			typeof boosted.looktypeEx === "number" && boosted.looktypeEx > 0
				? boosted.looktypeEx
				: undefined,
	};
	return (
		<div
			className={cn(
				"group relative grid h-20 w-full grid-cols-[1fr_auto] rounded-md bg-linear-60 p-2",
				kind === "boss"
					? " from-red-900/90 to-fuchsia-900/80"
					: " from-green-900/90 to-blue-900/80",
			)}
		>
			<div
				className={cn(
					"absolute inset-0 rounded-md bg-[url('/backgrounds/wallpaper4.jpg')] bg-center bg-cover opacity-30 mix-blend-overlay",
					kind === "boss"
						? "bg-[url('/backgrounds/wallpaper4.jpg')]"
						: "bg-[url('/backgrounds/wallpaper1.jpg')]",
				)}
			/>
			<div
				className={cn(
					"relative flex flex-col justify-center",
					kind === "boss" ? "text-rose-200" : "text-emerald-200",
				)}
			>
				<motion.span
					className={cn(
						"font-semibold text-sm",
						kind === "boss" ? "text-rose-200" : "text-emerald-200",
					)}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
				>
					{kind.charAt(0).toUpperCase() + kind.slice(1)}
				</motion.span>
				<motion.span
					className={cn(
						"text-nowrap text-xs",
						kind === "boss" ? "text-rose-300/80" : "text-emerald-300/80",
					)}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
				>
					{boosted.boostname}
				</motion.span>
			</div>
			<motion.div
				className="flex items-center justify-center"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
			>
				<OutfitComponent outfit={boostedOutfit} />
			</motion.div>
		</div>
	);
};

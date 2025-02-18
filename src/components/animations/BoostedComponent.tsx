"use client";
import React from "react";

import OutfitComponent from "@/components/animations/OutfitComponent";
import type { BoostedProps, Outfit } from "./types";

function toProperCase(str: string) {
	return str
		.replace(/([A-Z])/g, (c) => ` ${c.toLowerCase()}`)
		.replace(/^./, (str) => str.toUpperCase());
}

interface BoostedComponentProps {
	kind: "boss" | "creature";
	boosted: BoostedProps | null;
	tooltip?: boolean;
}

export default function BoostedComponent({ kind, boosted }: BoostedComponentProps) {
	if (!boosted) {
		return null;
	}

	const boostedOutfit: Outfit = {
		looktype: boosted.looktype,
		lookaddons: boosted.lookaddons,
		lookbody: boosted.lookbody,
		lookfeet: boosted.lookfeet,
		looklegs: boosted.looklegs,
		lookhead: boosted.lookhead,
		lookmount: boosted.lookmount,
		looktypeEx: boosted.looktypeEx ?? undefined,
	};

	return (
		<div
			className="relative flex justify-center rounded-token transition-all duration-300 ease-in-out hover:scale-110"
			data-tooltip={`Boosted ${toProperCase(kind)}: ${boosted.boostname ?? ""}`}
		>
			<OutfitComponent
				outfit={boostedOutfit}
				alt={boosted.boostname ?? ""}
				className="-left-4 -top-3 h-16 w-16"
			/>
		</div>
	);
}

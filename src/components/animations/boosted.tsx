"use client";
import React from "react";

import AnimatedOutfit from "./AnimatedOutfit";
import type { BoostedProps } from "./types";

export function toProperCase(str: string) {
	return str
		.replace(/([A-Z])/g, (c) => ` ${c.toLowerCase()}`)
		.replace(/^./, (str) => str.toUpperCase());
}

interface BoostedComponentProps {
	kind: "boss" | "creature";
	boosted: BoostedProps | null;
	tooltip?: boolean;
}

const BoostedComponent = ({ kind, boosted }: BoostedComponentProps) => {
	if (!boosted) {
		return null;
	}

	return (
		<div
			className="relative rounded-token p-2 transition-all duration-300 ease-in-out hover:scale-110"
			data-tooltip={`Boosted ${toProperCase(kind)}: ${boosted.boostname ?? ""}`}
			data-offset="20"
		>
			<AnimatedOutfit
				outfit={boosted}
				alt={boosted.boostname ?? ""}
				className="-bottom-4 right-4 h-16 w-16"
			/>
		</div>
	);
};

export default BoostedComponent;

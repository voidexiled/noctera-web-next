"use client";
import { fetchPlayersTopFive } from "@/actions/general/highscores/actions";
import OutfitComponent from "@/components/animations/OutfitComponent";
import type { Outfit } from "@/components/animations/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVocation } from "@/utils/functions/getVocations";
import type { players } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type HighscoresCardType = {
	players: players[];
};
export const HighscoresCard = ({ players }: HighscoresCardType) => {
	const emptyRows = new Array(5 - players.length).fill(null);

	return (
		<Card className="overflow-hidden rounded-md border-none">
			<div className="relative z-[1]">
				<CardHeader className="pb-2">
					<CardTitle className="text-base text-card-foreground/90 leading-none">
						Highscores
					</CardTitle>
				</CardHeader>
				<CardContent className="gap-0 p-0">
					<div className="grid grid-cols-1 grid-rows-5">
						{players.map((player, index) => {
							const playerOutfit: Outfit = {
								looktype: player.looktype,
								lookhead: player.lookhead,
								lookbody: player.lookbody,
								looklegs: player.looklegs,
								lookfeet: player.lookfeet,
								lookaddons: player.lookaddons,
							};

							return (
								<Link
									key={player.id}
									className="grid h-13 grid-cols-[15px_55px_1fr] items-center justify-start overflow-hidden px-2 py-1 transition-colors delay-0 duration-150 hover:bg-blue-600/10"
									href={`/characters/${player.name}`}
								>
									<div className="relative grid h-full w-full">
										<span className="m-auto text-card-foreground/75 text-xs">{index + 1}.</span>
									</div>
									<div className="relative h-full w-full">
										<OutfitComponent
											outfit={playerOutfit}
											className="absolute right-1.5 bottom-0.5"
										/>
									</div>
									<div className="grid h-full grid-rows-2 items-center text-start text-card-foreground/90 text-sm">
										<span className="overflow-hidden text-ellipsis text-nowrap">{player.name}</span>
										<span className="overflow-hidden text-ellipsis text-nowrap text-card-foreground/75 text-xs">
											Level: {player.level} / {getVocation(player.vocation)}
										</span>
									</div>
								</Link>
							);
						})}
						{emptyRows.map((_, idx) => (
							<div
								key={`empty-row-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									idx
								}`}
								className="h-13"
							/>
						))}
					</div>
				</CardContent>
			</div>
		</Card>
	);
};

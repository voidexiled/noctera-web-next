"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountdownProps } from "@/lib/lib";
import getServerSaveTime, { calculateTimeRemainingUntil } from "@/lib/utils";
import type { ConfigLua } from "@/utils/readConfigLua";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function Countdown({ hour, min, sec, nowDate }: CountdownProps & { nowDate: Date }) {
	const [countdown, setCountdown] = useState(
		calculateTimeRemainingUntil({ hour, min, sec, nowDate }),
	);

	const formattedCountdown = useMemo(() => {
		return {
			hours: countdown.hours.toString().padStart(2, "0"),
			minutes: countdown.minutes.toString().padStart(2, "0"),
			seconds: countdown.seconds.toString().padStart(2, "0"),
		};
	}, [countdown]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const updatedDate = new Date();
			setCountdown(calculateTimeRemainingUntil({ hour, min, sec, nowDate: updatedDate }));
		}, 1000);

		return () => clearInterval(intervalId);
	}, [hour, min, sec]);

	return (
		<Card className="relative overflow-hidden rounded-md border-0 shadow-xl">
			{/* Efecto de brillo superior */}
			<div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

			<CardHeader className="pb-2">
				<CardTitle className="relative text-center font-normal text-lg text-white/90">
					Server Save
					<motion.div
						className="-bottom-1 absolute left-1/2 h-px rounded-full bg-blue-400/20"
						initial={{ width: 0, x: "-50%" }}
						animate={{ width: "75%" }}
						transition={{ duration: 1.2, ease: "easeOut" }}
					/>
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 pb-4">
				<div className="relative flex items-center justify-center gap-1 p-2">
					{/* Círculo de progreso */}
					<svg className="-rotate-90 absolute h-full w-full">
						<circle
							cx="50%"
							cy="50%"
							r="48%"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							className="text-blue-500/5"
						/>
					</svg>

					{/* Tiempo */}
					<TimeUnit value={formattedCountdown.hours} label="h" />
					<span className="animate-pulse cursor-context-menu text-blue-400/80">:</span>
					<TimeUnit value={formattedCountdown.minutes} label="m" />
					<span className="animate-pulse cursor-context-menu text-blue-400/80">:</span>
					<TimeUnit value={formattedCountdown.seconds} label="s" />
				</div>
			</CardContent>

			{/* Efecto de brillo inferior */}
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
		</Card>
	);
}

function TimeUnit({ value, label }: { value: string; label: string }) {
	return (
		<div className="group relative">
			<motion.div
				className="flex flex-col items-center"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
				<span className="relative z-10 cursor-context-menu font-mono text-2xl text-white/90 tabular-nums transition-colors group-hover:text-blue-300">
					{value}
				</span>
				<span className="cursor-context-menu font-medium text-[10px] text-blue-400/60 tracking-wider">
					{label}
				</span>
			</motion.div>
			{/* Reflejo */}
			<div className="-bottom-3 absolute right-0 left-0 h-4 cursor-context-menu rounded-full bg-gradient-to-b from-blue-500/5 to-transparent blur-sm" />
		</div>
	);
}

export default Countdown;

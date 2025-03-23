"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Ticket, XCircle } from "lucide-react";
import Link from "next/link";

export function ErrorMesssage() {
	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<XCircle className="h-18 w-18 text-red-600" />
			</motion.div>
			<motion.h1
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35, duration: 0.5, ease: "easeInOut" }}
				className="relative mb-6 text-center font-bold text-5xl text-teal-100 "
			>
				Payment wasn't successful
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.45, ease: "easeInOut" }}
				className="text-center text-lg"
			>
				We were unable to process your payment. Please try again or contact us at{" "}
				<a
					href="mailto:support@noctera.com"
					className="hover:underline-text-card-foreground text-card-foreground hover:underline"
				>
					support@noctera.com
				</a>
				.
			</motion.p>
			<motion.div
				initial={{ opacity: 0, zoom: 0.75, y: 15 }}
				animate={{ opacity: 1, zoom: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.45, ease: "backInOut" }}
				className="mt-2 grid grid-cols-2 items-center justify-center gap-4"
			>
				<Button variant="default" size="sm" className="mt-6 grow" asChild>
					<Link href="/account-manager/" className="flex flex-row">
						<Ticket className="mr-2 h-4 w-4 text-xl" />
						<span>Open ticket</span>
					</Link>
				</Button>
				<Button variant="blue" size="sm" className="mt-6 grow" asChild>
					<Link href="/account-manager" className="flex flex-row">
						<span>Try again</span>
						<ReloadIcon className="ml-2 h-4 w-4 text-xl" />
					</Link>
				</Button>
			</motion.div>
		</>
	);
}

"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Home, MailIcon } from "lucide-react";
import Link from "next/link";

export function SuccessMessage() {
	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<CheckCircle className=" h-18 w-18 text-green-600" />
			</motion.div>
			<motion.h1
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35, duration: 0.5, ease: "easeInOut" }}
				className="relative mb-6 text-center font-bold text-5xl text-teal-100 "
			>
				Thank you for your purchase!
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.45, ease: "easeInOut" }}
				className="text-center text-lg"
			>
				Your order has been successfully processed. We've sent you an email with all the details.
			</motion.p>
			<motion.div
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.725, duration: 0.45, ease: "easeInOut" }}
				className="mt-6 flex flex-row items-center rounded-sm border px-3 py-2"
			>
				<MailIcon className="mr-3 h-4 w-4 text-gray-400" />
				<span className="text-gray-400 text-sm">
					Need help? Contact us at{" "}
					<a
						href="mailto:support@noctera.com"
						className="hover:underline-text-card-foreground text-card-foreground hover:underline"
					>
						support@noctera.com
					</a>
				</span>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, zoom: 0.75, y: 15 }}
				animate={{ opacity: 1, zoom: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.45, ease: "backInOut" }}
				className="mt-2 grid grid-cols-2 items-center justify-center gap-4"
			>
				<Button variant="default" size="sm" className="mt-6 grow" asChild>
					<Link href="/" className="flex flex-row">
						<Home className="mr-2 h-4 w-4 text-xl" />
						<span>Return to home</span>
					</Link>
				</Button>
				<Button variant="blue" size="sm" className="mt-6 grow" asChild>
					<Link href="/account-manager" className="flex flex-row">
						<span>View account details</span>
						<ArrowRight className="ml-2 h-4 w-4 text-xl" />
					</Link>
				</Button>
			</motion.div>
		</>
	);
}

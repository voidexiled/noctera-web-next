"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" className="rounded-sm">
					<Icon
						icon={"lucide:sun"}
						className="dark:-rotate-90 h-[1rem] w-[1rem] rotate-0 scale-100 transition-all duration-200 dark:scale-0"
					/>
					<Icon
						icon={"lucide:moon"}
						className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
					/>
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

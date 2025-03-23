"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
	UndoDot,
} from "lucide-react";

import OutfitComponent from "@/components/animations/OutfitComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser({
	character,
}: {
	character: {
		name: string;
		email: string;
	};
}) {
	const router = useRouter();
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="relative h-8 w-8 rounded-lg">
								<OutfitComponent
									className="absolute right-0 bottom-0"
									outfit={{
										looktype: 302,
										lookhead: 0,
										lookbody: 0,
										looklegs: 0,
										lookfeet: 0,
										lookaddons: 0,
										lookmount: 0,
									}}
								/>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{character.name}</span>
								<span className="truncate text-xs">{character.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-none bg-popover"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="relatiev h-8 w-8 rounded-lg">
									<OutfitComponent
										className="absolute right-0 bottom-0"
										outfit={{
											looktype: 302,
											lookhead: 0,
											lookbody: 0,
											looklegs: 0,
											lookfeet: 0,
											lookaddons: 0,
											lookmount: 0,
										}}
									/>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{character.name}</span>
									<span className="truncate text-xs">{character.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* <DropdownMenuGroup>
							<DropdownMenuItem className="gap-2 text-xs">
								<Sparkles className="h-4 w-4" />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator /> */}
						<DropdownMenuItem className="gap-2 text-xs" asChild>
							<Link href="/" title="Principal page" onClick={() => revalidatePath("/")}>
								<UndoDot className="h-4 w-4" />
								Exit dashboard
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

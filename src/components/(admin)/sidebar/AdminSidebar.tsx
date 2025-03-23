"use client";

import {
	AudioWaveform,
	BadgeDollarSign,
	BookOpen,
	Bot,
	CircleUser,
	Command,
	Dice6,
	Flame,
	Frame,
	GalleryVerticalEnd,
	Gamepad2,
	Home,
	Map as MapIcon,
	Package,
	PenSquare,
	PieChart,
	Settings2,
	Shield,
	SquareTerminal,
	Ticket,
	TrendingUp,
	Users,
} from "lucide-react";
import type * as React from "react";

import { AdminSidebarHeader } from "@/components/(admin)/sidebar/AdminSidebarHeader";
import { NavMain } from "@/components/(admin)/sidebar/nav-main";
import { NavProjects } from "@/components/(admin)/sidebar/nav-projects";
import { NavUser } from "@/components/(admin)/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import type { players } from "@prisma/client";

const data = {
	accsAndPlayersManagementNav: [
		{
			title: "Accounts",
			url: "#",
			icon: CircleUser,
			isActive: false,
			items: [
				{
					title: "Account list",
					url: "#",
				},
				{
					title: "Create account",
					url: "#",
				},
				{
					title: "Edit account",
					url: "#",
				},
				{
					title: "Account details",
					url: "#",
				},
			],
		},
		{
			title: "Players",
			url: "#",
			icon: Users,
			items: [
				{
					title: "Players list",
					url: "#",
				},
				{
					title: "Create character",
					url: "#",
				},
				{
					title: "Edit character",
					url: "#",
				},
				{
					title: "Character details",
					url: "#",
				},
				{
					title: "Online players",
					url: "#",
				},
			],
		},
	],
	gameManagementNav: [
		{
			title: "Guilds",
			url: "#",
			icon: Shield,
			isActive: false,
			items: [
				{
					title: "Guild list",
					url: "#",
				},
				{
					title: "Create guild",
					url: "#",
				},
				{
					title: "Edit guild",
					url: "#",
				},
				{
					title: "Guild details",
					url: "#",
				},
				{
					title: "Guild wars",
					url: "#",
				},
				{
					title: "Guild ranks",
					url: "#",
				},
			],
		},
		{
			title: "Market",
			url: "#",
			icon: TrendingUp,
			isActive: false,
			items: [
				{
					title: "Market offers",
					url: "#",
				},
				{
					title: "Market history",
					url: "#",
				},
			],
		},
		{
			title: "Houses",
			url: "#",
			icon: Home,
			isActive: false,
			items: [
				{
					title: "House list",
					url: "#",
				},
				{
					title: "Edit house",
					url: "#",
				},
				{
					title: "House invited list",
					url: "#",
				},
			],
		},
		{
			title: "Noctera pass",
			url: "#",
			icon: Flame,
			isActive: false,
			items: [
				{
					title: "Seasons",
					url: "#",
				},
				{
					title: "Rewards",
					url: "#",
				},
				{
					title: "Template tasks",
					url: "#",
				},
				{
					title: "Player progress",
					url: "#",
				},
				{
					title: "Player claimed rewards",
					url: "#",
				},
				{
					title: "Player tasks",
					url: "#",
				},
			],
		},
		{
			title: "Roulette rewards",
			url: "#",
			icon: Dice6,
			isActive: false,
			items: [
				{
					title: "Rewards history",
					url: "#",
				},
			],
		},
	],
	storeAndEconomyManagementNav: [
		{
			title: "Exchange rates",
			url: "#",
			icon: BadgeDollarSign,
			isActive: false,
			items: [
				{
					title: "Manage exchange rates",
					url: "#",
				},
			],
		},
		{
			title: "Products",
			url: "#",
			icon: Package,
			isActive: false,
			items: [
				{
					title: "Product categories",
					url: "#",
				},
				{
					title: "Products",
					url: "#",
				},
				{
					title: "Orders",
					url: "#",
				},
			],
		},
	],
	websiteContentManagementNav: [
		{
			title: "Posts/News",
			url: "#",
			icon: PenSquare,
			isActive: false,
			items: [
				{
					title: "New post",
					url: "/admin/blog/new-post",
				},
				{
					title: "Post list",
					url: "/admin/blog/post-list",
				},
				{
					title: "Edit post",
					url: "#",
				},
				{
					title: "Post details",
					url: "#",
				},
			],
		},
	],
	tools: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
		},
	],
};

export function AdminSidebar({
	character,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	character: {
		name: string;
		email: string;
	};
}) {
	return (
		<Sidebar collapsible="icon" {...props} className="border-none">
			<SidebarHeader>
				<AdminSidebarHeader />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.accsAndPlayersManagementNav} title="Accounts Management" />
				<NavMain items={data.gameManagementNav} title="Game Management" />
				<NavMain items={data.storeAndEconomyManagementNav} title="Store & Economy Management" />
				<NavMain items={data.websiteContentManagementNav} title="Website Content Management" />
				<NavProjects projects={data.tools} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser character={character} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

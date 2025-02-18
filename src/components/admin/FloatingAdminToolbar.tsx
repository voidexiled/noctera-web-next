"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	AwardIcon,
	BoxIcon,
	FilesIcon,
	GamepadIcon,
	NewspaperIcon,
	StoreIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

import {
	AdminToolbarContext,
	type AdminToolbarContextType,
	AdminToolbarProvider,
} from "@/components/admin/context/AdminToolbarContext";
import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const Item = ({
	children,
	className,
	onClick,
}: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
	return (
		<DropdownMenuItem
			onClick={onClick}
			className={cn(
				"hover:cursor-pointer hover:bg-primary/40 hover:text-primary-foreground",
				className,
			)}
		>
			{children}
		</DropdownMenuItem>
	);
};
const Separator = ({ className }: { className?: string }) => {
	return <DropdownMenuSeparator className={cn("my-0 bg-background p-0", className)} />;
};

export const FloatingAdminToolbar = () => {
	const { isOpenDialogViewAllAccounts, setIsOpenDialogViewAllAccounts } = useContext(
		AdminToolbarContext,
	) as AdminToolbarContextType;

	const { data: session } = useSession();
	const user = session?.user;
	const userRole = user?.role;

	if (!userRole || userRole !== "admin") return null;

	const accountsMenuItems = () => {
		return (
			<DropdownMenuContent
				className="ml-2 border-background bg-background/70 p-0"
				align="start"
				side="right"
			>
				<DropdownMenuLabel>Manage Accounts</DropdownMenuLabel>
				<Separator />

				<Item
					className="hover:bg-secondary/80"
					onClick={() => setIsOpenDialogViewAllAccounts(!isOpenDialogViewAllAccounts)}
				>
					<span>View all</span>
				</Item>
			</DropdownMenuContent>
		);
	};

	return (
		<div className="fixed top-0 bottom-0 left-3 z-100 my-auto h-fit w-fit flex-col items-center gap-4 rounded-full p-2 ">
			<TooltipProvider>
				<ToolbarItem tooltipText="Accounts" dropdownItems={accountsMenuItems()}>
					<UserIcon />
				</ToolbarItem>
				<ToolbarItem
					tooltipText="Characters"
					onClick={() => {
						toast("Default toast");
					}}
				>
					<UsersIcon />
				</ToolbarItem>
				<ToolbarItem
					tooltipText="News"
					onClick={() => {
						toast.success("Success toast");
					}}
				>
					<NewspaperIcon />
				</ToolbarItem>
				<ToolbarItem
					tooltipText="Battlepass"
					onClick={() => {
						toast.error("Error toast");
					}}
				>
					<AwardIcon />
				</ToolbarItem>
				<ToolbarItem
					tooltipText="Shop"
					onClick={() => {
						toast.info("Info toast");
					}}
				>
					<StoreIcon />
				</ToolbarItem>
				<ToolbarItem
					tooltipText="Shop"
					onClick={() => {
						toast.warning("Warning toast");
					}}
				>
					<StoreIcon />
				</ToolbarItem>
			</TooltipProvider>
			<DialogViewAllAccounts />
		</div>
	);
};

const ToolbarItem = ({
	children,
	tooltipText,
	dropdownItems,
	onClick,
}: {
	children: React.ReactNode;
	tooltipText?: string;
	dropdownItems?: React.ReactNode;
	onClick?: () => void;
}) => {
	return (
		<DropdownMenu>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<div
							className="my-3 flex h-10 w-10 flex-row items-center justify-center rounded-full bg-background/70 p-2 transition-all delay-0 duration-150 hover:scale-[1.08] hover:cursor-pointer hover:bg-background"
							onClick={onClick}
						>
							{children}
						</div>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				{tooltipText && (
					<TooltipContent className="max-w-[150px]" side="right" sideOffset={12}>
						<div className="flex flex-col gap-2">{tooltipText}</div>
					</TooltipContent>
				)}
				{dropdownItems && dropdownItems}
			</Tooltip>
		</DropdownMenu>
	);
};

const DialogViewAllAccounts = () => {
	const { isOpenDialogViewAllAccounts, setIsOpenDialogViewAllAccounts } = useContext(
		AdminToolbarContext,
	) as AdminToolbarContextType;
	return (
		<Dialog open={isOpenDialogViewAllAccounts} onOpenChange={setIsOpenDialogViewAllAccounts}>
			<DialogContent>
				<div>Hello all accounts</div>
				<DialogClose asChild>
					<Button variant="outline" className="my-2">
						Close
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};

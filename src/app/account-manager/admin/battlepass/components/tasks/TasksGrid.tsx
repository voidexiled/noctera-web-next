import { getTaskPath } from "@/app/(battlepass)/battlepass/lib/utils";
import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import type { battlepass_seasons } from "@prisma/client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { format } from "date-fns-tz";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

export const TasksGrid = () => {
	const { toast } = useToast();
	const { seasons, tasks, refetchSeasons } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const handleDeleteSeason = async (id: number) => {
		try {
			const res = await fetch("/api/battlepass/season/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: id,
				}),
			});
			if (res.status === 200) {
				toast({
					title: "Delete Season",
					description: <div>Season with id {id} has been deleted.</div>,
				});
				refetchSeasons();
			}
		} catch (error) {
			const err = error as Error;
			err;
			toast({
				title: "Error:",
				variant: "destructive",
				description: <div>{err.message}</div>,
			});
		}
	};

	return (
		<TooltipProvider>
			<ScrollArea
				className="h-full w-full scroll-smooth border-b pb-2"
				scrollHideDelay={3000}
			>
				<ScrollBar orientation="horizontal" className="z-50" />
				<div className="flex flex-row gap-2 p-2">
					{tasks.map((task) => {
						return (
							<div
								className="group no-draggable no-selectable relative mr-4 grid h-[140px] w-[150px] grid-cols-1 grid-rows-[20px_1fr] overflow-hidden rounded-md bg-secondary/40 shadow-sm transition-all duration-300 hover:bg-secondary/60"
								key={task.id}
							>
								<div className="relative flex w-full flex-row items-center justify-center bg-background/50 text-card-foreground/80 text-sm">
									<span className="z-10">
										<div className="flex flex-row items-center justify-center gap-1">
											<span>{task.task_amount}</span>
										</div>
									</span>
								</div>

								<div className="relative grid h-full w-full grid-cols-1 grid-rows-[1fr_35px] items-center justify-start px-2">
									<span className="absolute top-2 left-1 z-10 text-center text-secondary-foreground/60 text-xs">
										+ {task.task_battlepass_exp_reward} exp
									</span>
									<div className="grid h-full w-full place-self-start pt-3 ">
										<img
											src={getTaskPath(task.task_type, task.task_img)}
											alt={`${task.task_name} task-${task.id}`}
											width={48}
											height={48}
											className="no-draggable no-selectable m-auto"
										/>
									</div>
									<span className="text-center text-secondary-foreground/90 text-xs">
										{task.task_name}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</TooltipProvider>
	);
};

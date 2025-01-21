"use client"
import { getTaskPath } from "@/app/(battlepass)/battlepass/lib/utils";
import type { battlepass_seasons_tasks, player_battlepass_tasks } from "@prisma/client";

type BattlepassTaskType = {
	task: battlepass_seasons_tasks;
	playerTask: player_battlepass_tasks | undefined;
};

export const BattlepassTask = ({ task, playerTask }: BattlepassTaskType) => {
	if (!playerTask)
		return (
			<div className="flex flex-col items-start justify-start">
				<div className="flex flex-row items-center justify-center text-xs">
					You need to accept this task
				</div>
				{task.task_name}
			</div>
		);
	return (
		<div className="group no-draggable no-selectable relative mr-4 grid h-[140px] w-[150px] grid-cols-1 grid-rows-[20px_1fr] overflow-hidden rounded-md bg-secondary/40 shadow-sm transition-all duration-300 hover:bg-secondary/60">
			<div className="relative flex w-full flex-row items-center justify-center bg-background/50 text-card-foreground/80 text-sm">
				<div
					className="absolute top-0 left-0 h-full bg-accent/80"
					style={{
						width: `${(playerTask.current_amount / task.task_amount) * 100}%`,
					}}
				/>

				<span className="z-10">
					{playerTask.current_amount === task.task_amount ? (
						"Finished"
					) : (
						<div className="flex flex-row items-center justify-center gap-1">
							<span>{playerTask.current_amount}</span>
							<span>/</span>
							<span>{task.task_amount}</span>
						</div>
					)}
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
};

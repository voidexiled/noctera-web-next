"use client";

import { SeasonsGrid } from "@/app/account-manager/admin/battlepass/components/seasons/SeasonsGrid";
import { NewTasksForm } from "@/app/account-manager/admin/battlepass/components/tasks/NewTasksForm";

import { TasksGrid } from "@/app/account-manager/admin/battlepass/components/tasks/TasksGrid";

export const TasksContent = () => {
	return (
		<div className="grid grid-rows-[auto_1fr] overflow-hidden">
			<TasksGrid />
			<NewTasksForm />
		</div>
	);
};

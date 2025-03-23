"use client";

import { SeasonsGrid } from "@/app/(default)/account-manager/admin/battlepass/components/seasons/SeasonsGrid";
import { NewTasksForm } from "@/app/(default)/account-manager/admin/battlepass/components/tasks/NewTasksForm";

import { TasksGrid } from "@/app/(default)/account-manager/admin/battlepass/components/tasks/TasksGrid";

export const TasksContent = () => {
	return (
		<div className="grid grid-rows-[auto_1fr] overflow-hidden">
			<TasksGrid />
			<NewTasksForm />
		</div>
	);
};

"use client";

import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BATTLEPASS_TYPE_TASKS } from "@prisma/client";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const NewTasksForm = () => {
	const { seasons, tasks, mostUsedSeasonId } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;
	const { toast } = useToast();

	const formSchema = z.object({
		season_id: z.string(),
		task_name: z.string(),
		task_img: z.string(),
		task_value: z.string(),
		task_type: z.string(),
		task_amount: z.string(),
		task_battlepass_exp_reward: z.string(),
		available_from: z.date(),
	});

	type NewTaskFormValues = z.infer<typeof formSchema>;

	const latestSeason = seasons[seasons.length - 1];
	const methods = useForm<NewTaskFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			season_id: mostUsedSeasonId?.toString() ?? latestSeason.id.toString(),
			task_name: "",
			task_img: "1.gif",
			task_value: "1",
			task_type: BATTLEPASS_TYPE_TASKS.MONSTER_KILL,
			task_amount: "1",
			task_battlepass_exp_reward: "5",
			available_from: new Date(),
		},
	});
	const {
		handleSubmit,
		watch,
		trigger,
		formState: { isSubmitting, errors },
	} = methods;
	const values = watch();

	async function onSubmit(data: NewTaskFormValues) {}

	return (
		<div className="flex flex-col gap-4 border-t p-2">
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<RHFSelect
					name="season_id"
					label="Season"
					LabelOption="label"
					keyValue="value"
					defaultValue={watch("season_id")}
					options={seasons.map((season) => {
						return {
							label:
								mostUsedSeasonId === season.id
									? `${season.season_name} (Current Season)`
									: season.season_name,
							value: season.id.toString(),
						};
					})}
					disabled={isSubmitting}
					onValueChange={() => {
						trigger("season_id");
					}}
				/>
				<div className="grid grid-cols-2 gap-4">
					<RHFSelect
						name="task_type"
						label="Type"
						LabelOption="label"
						keyValue="value"
						defaultValue={watch("task_type")}
						options={Object.values(BATTLEPASS_TYPE_TASKS).map((taskType) => {
							return {
								label: taskType,
								value: taskType,
							};
						})}
					/>
					<RHFTextField
						name="task_name"
						label="Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("task_name");
						}}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<RHFTextField
						name="task_value"
						label="Value"
						disabled={isSubmitting}
						onChange={() => {
							trigger("task_value");
						}}
					/>

					<RHFTextField
						name="task_amount"
						label="Amount"
						disabled={isSubmitting}
						onChange={() => {
							trigger("task_amount");
						}}
					/>
				</div>
				<RHFTextField
					name="task_img"
					label="Image Name"
					disabled={isSubmitting}
					onChange={() => {
						trigger("task_img");
					}}
				/>

				<RHFTextField
					name="task_battlepass_exp_reward"
					label="Exp Reward"
					disabled={isSubmitting}
					onChange={() => {
						trigger("task_battlepass_exp_reward");
					}}
				/>

				<RHFTextField
					name="available_from"
					label="Available From"
					disabled={isSubmitting}
					onChange={() => {
						trigger("available_from");
					}}
				/>
			</FormProvider>
		</div>
	);
};

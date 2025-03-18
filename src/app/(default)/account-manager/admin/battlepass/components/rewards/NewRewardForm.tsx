"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/(default)/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import RHFCheckbox from "@/components/common/hook-form/RHFCheckbox";
import RHFDatePicker from "@/components/common/hook-form/RHFDatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import RHFTextarea from "@/components/common/hook-form/RHFTextarea";
import { BATTLEPASS_RANK_ACCESS, BATTLEPASS_TYPE_REWARDS } from "@prisma/client";
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
import dayjs from "dayjs";
import { isFinite as validateIsFinite } from "lodash";
import { toast } from "sonner";

export const NewRewardForm = () => {
	const { seasons, rewards, tasks, refetchSeasons, mostUsedSeasonId, setMostUsedSeasonId } =
		useContext(AdminBattlepassContext) as AdminBattlepassContextType;

	const formSchema = z.object({
		level: z.string(),
		season_id: z.string(),
		reward_name: z.string(),
		reward_img: z.string(),
		reward_type: z.string(),
		reward_amount: z.string(),
		reward_value: z.string(),
		reward_should_plus_amount: z.boolean(),
		reward_required_access: z.string(),
		description: z.string(),
		visible: z.boolean(),
	});

	type NewRewardFormValues = z.infer<typeof formSchema>;

	const lastLevelNumber = 1;
	const latestSeason = seasons[seasons.length - 1];
	const methods = useForm<NewRewardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			level: lastLevelNumber.toString(),
			season_id: mostUsedSeasonId?.toString() ?? latestSeason.id.toString(),
			reward_name: "Reward",
			reward_img: "default.gif",
			reward_type: "ITEM",
			reward_amount: "0",
			reward_value: "1",
			reward_should_plus_amount: false,
			reward_required_access: "FREE",
			description: "",
			visible: true,
		},
	});

	const {
		handleSubmit,
		watch,
		trigger,
		formState: { isSubmitting, errors },
	} = methods;
	const values = watch();

	async function onSubmit(data: NewRewardFormValues) {
		fetch("/api/battlepass/rewards/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				season_id: data.season_id,
				level: data.level,
				reward_name: data.reward_name,
				reward_img: data.reward_img,
				reward_type: data.reward_type,
				reward_amount: data.reward_amount,
				reward_value: data.reward_value,
				reward_should_plus_amount: data.reward_should_plus_amount,
				reward_required_access: data.reward_required_access,
				description: data.description,
				visible: data.visible,
			}),
		})
			.then(async (res) => {
				if (res.status === 200) {
					toast.success(`${data.reward_name} has been created.`);

					refetchSeasons();
				}
			})
			.catch((e) => {
				const error: Error = e as Error;
				toast.error(error.message);
			});
	}

	return (
		<div className="flex flex-col gap-4 border-t p-2">
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<div className="grid grid-cols-[1fr_100px] gap-4">
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
					<RHFTextField
						name="level"
						label="Level"
						disabled={isSubmitting}
						onChange={() => {
							trigger("level");
						}}
						type="number"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<RHFSelect
						name="reward_type"
						label="Type"
						LabelOption="label"
						keyValue="value"
						defaultValue={watch("reward_type")}
						options={Object.values(BATTLEPASS_TYPE_REWARDS).map((rewardType) => {
							return {
								label: rewardType,
								value: rewardType,
							};
						})}
					/>

					<RHFSelect
						name="reward_required_access"
						label="Rank"
						LabelOption="label"
						keyValue="value"
						defaultValue={watch("reward_required_access")}
						options={Object.values(BATTLEPASS_RANK_ACCESS).map((rankAccess) => {
							return {
								label: rankAccess,
								value: rankAccess,
							};
						})}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<RHFTextField
						name="reward_name"
						label="Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_name");
						}}
					/>

					<RHFTextField
						name="reward_value"
						label="Value"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_value");
						}}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<RHFTextField
						name="reward_amount"
						label="Amount"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_amount");
						}}
					/>

					<RHFTextField
						name="reward_img"
						label="Image Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_img");
						}}
					/>
				</div>
				<RHFTextField
					name="description"
					label="Description"
					disabled={isSubmitting}
					onChange={() => {
						trigger("description");
					}}
				/>
				<RHFCheckbox
					name="reward_should_plus_amount"
					label="Merge amount"
					disabled={isSubmitting}
					onChange={() => {
						trigger("reward_should_plus_amount");
					}}
				/>
				<RHFCheckbox
					name="visible"
					label="Visible"
					disabled={isSubmitting}
					onChange={() => {
						trigger("visible");
					}}
				/>

				<Button size="sm">Add</Button>
			</FormProvider>
		</div>
	);
};

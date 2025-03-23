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
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
import dayjs from "dayjs";
import { isFinite as validateIsFinite } from "lodash";
import { toast } from "sonner";

interface NewSeasonFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NewSeasonForm({ className, ...props }: NewSeasonFormProps) {
	const { seasons, refetchSeasons } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;
	const router = useRouter();

	const lastSeasonNumber = seasons ? Math.max(...seasons.map((s) => Number(s.season_number))) : 1;
	const currentDate = new Date();

	const formSchema = z.object({
		season_number: z.string(),
		season_name: z.string(),
		date_start: z.date(),
		date_end: z.date(),
		background_img: z.string(),
		description: z.string(),
		update_players_progress: z.boolean(),
	});

	type NewSeasonFormValues = z.infer<typeof formSchema>;

	const nextSeasonNumber = validateIsFinite(lastSeasonNumber) ? lastSeasonNumber + 1 : 1;
	const methods = useForm<NewSeasonFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			season_number: `${nextSeasonNumber}`,
			season_name: `Season ${nextSeasonNumber}`,
			date_start: new Date(),
			date_end: new Date(),
			background_img: "default.png",
			description: "",
			update_players_progress: false,
		},
	});

	const {
		handleSubmit,
		watch,
		formState: { isSubmitting },
		trigger,
	} = methods;

	const TARGET_TIMEZONE = "America/Mexico_City";

	async function onSubmit(data: NewSeasonFormValues) {
		fetch("/api/battlepass/season/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				season_number: data.season_number,
				season_name: data.season_name,
				date_start: data.date_start,
				date_end: data.date_end,
				background_img: data.background_img,
				description: data.description,
			}),
		})
			.then(async (res) => {
				if (res.status === 200) {
					toast.success(`${data.season_name} has been created.`);
					refetchSeasons();
				}
			})
			.catch((e) => {
				const error: Error = e as Error;
				console.error(error);
				toast.error(error.message);
			});
	}

	return (
		<div className={cn("flex flex-col gap-4 p-2", className)} {...props}>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<RHFTextField
					name="season_number"
					label="Number"
					disabled={isSubmitting}
					onChange={() => {
						trigger("season_number");
					}}
				/>

				<RHFTextField
					name="season_name"
					label="Title"
					placeholder="Season x: the title of the season"
					type="text"
					disabled={isSubmitting}
					onChange={() => {
						trigger("season_name");
					}}
				/>

				<RHFTextarea
					name="description"
					label="Description"
					disabled={isSubmitting}
					onChange={() => {
						trigger("description");
					}}
				/>

				<RHFDatePicker
					name="date_start"
					label="Start Date"
					disabled={isSubmitting}
					onChange={() => {
						trigger("date_start");
					}}
				/>

				<RHFDatePicker
					name="date_end"
					label="End Date"
					disabled={isSubmitting}
					onChange={(date) => {
						trigger("date_end");
					}}
				/>

				<RHFTextField
					name="background_img"
					label="Background Image Name"
					disabled={isSubmitting}
					onChange={() => {
						trigger("background_img");
					}}
				/>

				{/* <RHFCheckbox
					name="update_players_progress"
					label="Update Players Progress"
					
					disabled={isSubmitting}
				/> */}
				<Button type="submit" className="mt-2">
					Deploy
				</Button>
			</FormProvider>
		</div>
	);
}

"use client";
import { generateRandomName } from "@/components/(account-manager)/(auth)/register/utils/functions";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import RHFCheckbox from "@/components/common/hook-form/RHFCheckbox";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const vocationOptions = [
	{ value: "1", label: "Sorcerer" },
	{ value: "2", label: "Druid" },
	{ value: "3", label: "Paladin" },
	{ value: "4", label: "Knight" },
];

export function CreateCharacterButton() {
	const router = useRouter();

	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

	const characterFormSchema = z.object({
		name: z.string().min(1),
		sex: z.string(),
		wLocation: z.string().optional(),
		wType: z.string().optional(),
		world_id: z.string().optional(),
		vocation: z.string().min(1),
		//tutorial: z.boolean(),
	});

	type CharacterFormValues = z.infer<typeof characterFormSchema>;

	const methods = useForm<CharacterFormValues>({
		resolver: zodResolver(characterFormSchema),
		defaultValues: {
			sex: "0",
			vocation: "1",
			//tutorial: true,
		},
	});

	const {
		reset,
		handleSubmit,
		trigger,
		formState: { isSubmitting },
	} = methods;

	async function onSubmit(data: CharacterFormValues) {
		try {
			toast
				.promise(
					fetch("/api/accounts/players", {
						method: "POST",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
						},
						body: JSON.stringify({
							name: data.name,
							sex: +data.sex,
							vocation: data.vocation,
							//tutorial: data.tutorial
						}),
					}),
					{
						loading: "Creating character...",
						success: "Character has been created.",
						error: (err) => `${err}`,
					},
				)
				.unwrap()
				.then((res) => {
					if (res.status === 200) {
						router.refresh();
						handle(false);
						return;
					}
				});
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
			reset();
		}
	}

	function handle(value: boolean) {
		if (!value) reset();
		setShowNewTeamDialog(value);
	}

	return (
		<>
			<Button size={"sm"} onClick={() => setShowNewTeamDialog(true)}>
				New Character
			</Button>

			{showNewTeamDialog && (
				<Dialog open={showNewTeamDialog} onOpenChange={handle}>
					<DialogContent>
						<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
							<DialogHeader>
								<DialogTitle>Create new Characters</DialogTitle>
							</DialogHeader>

							<div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 text-xs">
								Please choose a name and gender for your character. If you can't think of any
								fanciful name. In any case, the name must not violate the naming conventions
								established in the Noctera Rules, or your character may be deleted or the name
								blocked.
							</div>

							<div className="grid gap-4 py-2">
								<div className="grid gap-2 space-y-2">
									<RHFTextField
										label="Character Name"
										name="name"
										type="text"
										disabled={isSubmitting}
										actionLabel={
											<Label
												className="text-accent/90 text-xs transition-all hover:cursor-pointer hover:text-accent active:scale-[0.992]"
												onClick={() => {
													const newName = generateRandomName();
													methods.setValue("name", newName);
													trigger("name");
												}}
											>
												Generate Random
											</Label>
										}
									/>
									<RHFSelect
										LabelOption={"label"}
										keyValue={"value"}
										label="Sex"
										options={[
											{ value: "0", label: "Female" },
											{ value: "1", label: "Male" },
										]}
										name="sex"
										defaultValue={"0"}
										disabled={isSubmitting}
									/>
									<RHFSelect
										LabelOption={"label"}
										keyValue={"value"}
										label="Vocation"
										options={vocationOptions}
										name="vocation"
										defaultValue={"1"}
										disabled={isSubmitting}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									disabled={isSubmitting}
									onClick={() => {
										reset();
										setShowNewTeamDialog(false);
									}}
									variant="outline"
								>
									Cancel
								</Button>
								<Button disabled={isSubmitting} type="submit">
									{isSubmitting ? (
										<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
									) : (
										"Create"
									)}
								</Button>
							</DialogFooter>
						</FormProvider>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
